export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  password: (value: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (value.length < 8) {
      errors.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
};

export type ValidationRule = {
  validator: (value: any) => boolean | { valid: boolean; errors: string[] };
  message: string;
};

export function validate(
  value: any,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of rules) {
    const result = rule.validator(value);
    
    if (typeof result === 'boolean') {
      if (!result) {
        errors.push(rule.message);
      }
    } else {
      if (!result.valid) {
        errors.push(...result.errors);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
