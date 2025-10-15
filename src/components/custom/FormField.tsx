import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CHAR_LIMIT } from '@/lib/constants';

interface FormFieldProps {
  placeholder: string;
  id: string;
  type: string;
  label: string;
  registration: UseFormRegisterReturn;
  errors?: FieldError;
  isPasswordField?: boolean;
  hasLabelHidden?: boolean;
  className?: string;
  watch?: (name: string) => unknown[];
}

export default function FormField({
  placeholder,
  id,
  type,
  label,
  registration,
  errors,
  isPasswordField,
  hasLabelHidden,
  className,
  watch,
}: FormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return isPasswordField ? (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <Label className={hasLabelHidden ? 'sr-only' : ''} htmlFor={id}>
        {label}
      </Label>
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          type={isPasswordVisible ? 'text' : 'password'}
          id={id}
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="outline"
            className="rounded-full"
            size="icon-xs"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? 'hide password' : 'show password'}
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {errors && (
        <p role="alert" className="text-xs text-red-600">
          {errors.message}
        </p>
      )}
    </div>
  ) : (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <Label className={hasLabelHidden ? 'sr-only' : ''} htmlFor={id}>
        {label}
      </Label>
      <Input type={type} placeholder={placeholder} id={id} {...registration} />
      <div className="flex gap-3 ">
        {errors && (
          <p role="alert" className="text-xs text-red-600 ">
            {errors.message}
          </p>
        )}
        {watch ? (
          <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
            {(watch && watch(id)?.length) || 0} / {CHAR_LIMIT}
          </span>
        ) : null}
      </div>
    </div>
  );
}
