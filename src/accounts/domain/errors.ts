import { DomainError } from '../../shared/domain/domain-error.js';

export class InvalidAccountAliasError extends DomainError {
  readonly code = 'INVALID_ACCOUNT_ALIAS';
}

export class InvalidInstagramUserIdError extends DomainError {
  readonly code = 'INVALID_INSTAGRAM_USER_ID';
}

export class InvalidAccessTokenError extends DomainError {
  readonly code = 'INVALID_ACCESS_TOKEN';
}

export class AccountAlreadyExistsError extends DomainError {
  readonly code = 'ACCOUNT_ALREADY_EXISTS';
}

export class AccountNotFoundError extends DomainError {
  readonly code = 'ACCOUNT_NOT_FOUND';
}

export class AmbiguousAccountError extends DomainError {
  readonly code = 'AMBIGUOUS_ACCOUNT';
}
