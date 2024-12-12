const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const pool = require('./database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Google 전략 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 기존 사용자 확인
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
        ['google', profile.id]
      );

      if (existingUser.rows.length) {
        return done(null, existingUser.rows[0]);
      }

      // 새 사용자 생성
      const newUser = await pool.query(
        'INSERT INTO users (email, nickname, profile_image, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          profile.emails[0].value,
          profile.displayName,
          profile.photos[0].value,
          'google',
          profile.id
        ]
      );

      done(null, newUser.rows[0]);
    } catch (error) {
      done(error);
    }
  }
));

// Kakao 전략 설정
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Kakao profile:', profile); // 프로필 정보 확인용

      const existingUser = await pool.query(
        'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
        ['kakao', profile.id]
      );

      if (existingUser.rows.length) {
        return done(null, existingUser.rows[0]);
      }

      // 이메일이 없는 경우 대체 이메일 생성
      const email = profile._json.kakao_account?.email || `kakao_${profile.id}@example.com`;

      const newUser = await pool.query(
        'INSERT INTO users (email, nickname, profile_image, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          email,
          profile.displayName || `User${profile.id}`,
          profile._json.properties?.profile_image || null,
          'kakao',
          profile.id
        ]
      );

      done(null, newUser.rows[0]);
    } catch (error) {
      console.error('Kakao auth error:', error);
      done(error);
    }
  }
));

module.exports = passport;
