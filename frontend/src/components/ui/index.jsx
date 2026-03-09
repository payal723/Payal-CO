// Button
export const Button = ({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-purple-700 text-white hover:bg-purple-800 active:scale-95',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-95',
    outline: 'border-2 border-purple-700 text-purple-700 hover:bg-purple-50 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

// Input
export const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-all
        ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'}
        ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Select
export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`border rounded-lg px-3 py-2.5 text-sm outline-none transition-all bg-white
        ${error ? 'border-red-400' : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'}
        ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Badge
const badgeColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Paid: 'bg-green-100 text-green-800',
  COD: 'bg-gray-100 text-gray-700',
  default: 'bg-gray-100 text-gray-700',
};

export const Badge = ({ label, className = '' }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[label] || badgeColors.default} ${className}`}>
    {label}
  </span>
);

// Spinner
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`} />
  );
};

// PageSpinner
export const PageSpinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

// Alert
export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};

// Card
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
    {children}
  </div>
);
