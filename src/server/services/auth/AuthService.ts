import { Request, Response, NextFunction } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportFacebook } from 'passport-facebook';
import { default as passportJwt } from 'passport-jwt';
import { default as jwt } from 'jsonwebtoken';

import { Environment, IConfig } from '../config';
import { IUser, User } from '../../models/mongoose';
import { Role } from './auth.types';
import { UnauthorizedError, ForbiddenError } from '../../utilities';

class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalStrategy = passportLocal.Strategy;
  private FacebookStrategy = passportFacebook.Strategy;
  private ExtractJwt = passportJwt.ExtractJwt;
  private JwtStrategy = passportJwt.Strategy;

  constructor(config: IConfig) {
    this.config = config;

    this.initializeLocalStrategy();
    this.initializeFacebookStrategy();
    this.initializeJwtStrategy();
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.passport = passport;
  }

  private initializeFacebookStrategy() {
    passport.use(new this.FacebookStrategy({
      clientID: this.config.auth.facebook.clientId,
      clientSecret: this.config.auth.facebook.clientSecret,
      callbackURL: 'http://localhost:8080/api/auth/facebook/tryanderror',
      profileFields: ['email', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email,
        firstName: first_name,
        lastName: last_name
      }
      const user = new User(userData);
      user.save();
      return done(user);
    }
    ));
  }

  private initializeLocalStrategy() {
    passport.use(
      new this.LocalStrategy(
        {
          usernameField: 'email',
        },
        async (email: string, password: string, done) => {
          try {
            const user = await User.findOne({
              email: email,
            });

            if (!user) {
              return done(null, false, { message: 'No user by that email' });
            }

            return user.comparePassword(password, (error: Error, isMatch: boolean) => {
              if (!isMatch) {
                return done(null, false);
              }
              return done(null, user);
            });
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  }

  initializeJwtStrategy = () => {
    passport.use(
      new this.JwtStrategy(
        {
          secretOrKey: this.config.auth.jwt.secret,
          jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (jwtPayload, done) => {
          try {
            const { id } = jwtPayload;

            const user = await User.findById(id);
            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  };

  public createToken(user: IUser): string {
    const payload = {
      id: user._id,
    };
    return jwt.sign(payload, this.config.auth.jwt.secret, {
      expiresIn: 60 * 120,
    });
  }

  public checkIsInRole = (...roles: Array<string>) => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      next(new ForbiddenError());
    }

    const hasRole = roles.find(role => (req.user as IUser).role === role);
    if (!hasRole) {
      next(new UnauthorizedError());
    }

    return next();
  };
}

export default AuthService;
