import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/libs/utils/utils';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
}

const variantClasses = {
  default: 'text-dark',
  primary: 'text-primary',
  success: 'text-safe',
  warning: 'text-warning',
  danger: 'text-danger',
  muted: 'text-gray-primary-0',
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideIcon, variant = 'default', className, size = 24, ...props }, ref) => {
    return (
      <LucideIcon
        ref={ref}
        size={size}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle,
  Check,
  X,
  XCircle,
  Search,
  Filter,
  Menu,
  User,
  Users,
  UserPlus,
  Mail,
  Send,
  FileText,
  Download,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Lock,
  Home,
  LogOut,
  LogIn,
  Calendar,
  Clock,
  Bell,
  TrendingUp,
  BarChart,
  Link,
  ExternalLink,
  Globe,
  Zap,
  Activity,
  Cpu,
  Database,
} from 'lucide-react';
