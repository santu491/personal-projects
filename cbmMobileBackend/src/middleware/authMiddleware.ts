import {StatusCodes} from 'http-status-codes';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {Action} from 'routing-controllers';
import {HeaderKeys, Messages} from '../constants';
import {AUTH_ROUTES} from '../routingConstants';
import {MemberOAuthPayload} from '../types/customRequest';
import {APP} from '../utils/app';
import {ResponseUtil} from '../utils/responseUtil';
import {decrypt} from '../utils/security/encryptionHandler';
const response = new ResponseUtil();

export const currentUserhandler = async (action: Action) => {
  let token;

  const jwtVerifyOptions = {
    ignoreExpiration: false,
  };

  if (
    action.request.url &&
    new RegExp(`${AUTH_ROUTES.refreshMemberAuth}`, 'i').test(action.request.url)
  ) {
    jwtVerifyOptions.ignoreExpiration = true;
  }

  if (
    action.request.headers.authorization &&
    action.request.headers.authorization.startsWith(`${HeaderKeys.BEARER} `)
  ) {
    token = action.request.headers.authorization.split(' ')[1];
    const jwtSecret = decrypt(APP.config.JWT) ?? '';
    const decoded = jwt.verify(
      token,
      jwtSecret,
      jwtVerifyOptions,
    ) as JwtPayload;

    // If the client ID is in the token(Member Profile API's), returns the user details
    if (decoded.clientId) {
      const userDetails: MemberOAuthPayload = {
        clientId: decoded.clientId,
        userName: decoded.userName,
        permissions: decoded.permissions,
        iamguid: decoded.iamguid,
        clientName: decoded.clientName,
        installationId: decoded?.installationId,
        sessionId: decoded?.sessionId,
      };
      return userDetails;
    }
  }
};

export const authenticationHandler = async (
  action: Action,
  allowedRoles: string[],
) => {
  const jwtVerifyOptions = {
    ignoreExpiration: false,
  };

  if (
    action.request.url &&
    new RegExp(`${AUTH_ROUTES.refreshMemberAuth}`, 'i').test(action.request.url)
  ) {
    jwtVerifyOptions.ignoreExpiration = true;
  }

  if (
    action.request.headers.authorization &&
    action.request.headers.authorization.startsWith(`${HeaderKeys.BEARER} `)
  ) {
    const token = action.request.headers.authorization.split(' ')[1];

    const jwtSecret = decrypt(APP.config.JWT) ?? '';
    const decoded = jwt.verify(
      token,
      jwtSecret,
      jwtVerifyOptions,
    ) as JwtPayload;

    // If the client ID is not in the list of allowed clients, return an error
    if (decoded.clientId) {
      return allowedRoles.includes(decoded.clientId);
    }

    if (!decoded || !decoded.userId || !decoded.userEmail) {
      const result = response.createException(Messages.userNotFound);
      return action.response.status(StatusCodes.UNAUTHORIZED).json({
        data: result.data,
      });
    }

    const {roles} = decoded;

    if (!roles || !roles.some((role: string) => allowedRoles.includes(role))) {
      return false;
    }
  }

  return true;
};
