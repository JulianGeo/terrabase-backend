import { ValidationError } from '@nestjs/common';

export const ValidationErrorToResponse = (error: ValidationError) => {
  const { constraints, children } = error;
  if (children.length > 0) return ValidationErrorsToResponse(children);
  return Object.keys(constraints);
};

export const ValidationErrorsToResponse = (errors: ValidationError[]) => errors.map((error) => ValidateErrorsFormToResponse(error.children));

export const ValidateErrorsFormToResponse = (errors: ValidationError[]) => {
  return errors.reduce((acc, error) => {
    acc[error.property] = ValidationErrorToResponse(error);
    return acc;
  }, {});
};
