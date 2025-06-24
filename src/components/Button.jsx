import { Button as MuiButton, CircularProgress } from '@mui/material';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Button = forwardRef(({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  fullWidth = false,
  type = 'button',
  testId,
  loadingText = 'Загрузка...',
  ...props
}, ref) => {
  const handleClick = (event) => {
    if (!loading && !disabled && onClick) {
      onClick(event);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={!loading ? endIcon : undefined}
      fullWidth={fullWidth}
      type={type}
      data-testid={testId}
      {...props}
    >
      {loading ? loadingText : children}
    </MuiButton>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  testId: PropTypes.string,
  loadingText: PropTypes.string,
};

export default Button;
