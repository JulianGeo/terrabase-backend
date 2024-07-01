import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export function Match(property: string, options?: ValidationOptions & { isOptional?: boolean }) {
  return (object: any, propertyName: string) => {
    const { isOptional, ...validationOptions } = options;
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, isOptional],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName, isOptional] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return (isOptional && !relatedValue) || value === relatedValue;
  }
}
