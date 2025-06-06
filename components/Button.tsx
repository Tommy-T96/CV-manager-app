import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    // Variant styles
    if (variant === 'primary') {
      baseStyle.push(styles.primaryContainer);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryContainer);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineContainer);
    }
    
    // Size styles
    if (size === 'small') {
      baseStyle.push(styles.smallContainer);
    } else if (size === 'large') {
      baseStyle.push(styles.largeContainer);
    }
    
    // Width style
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    // Disabled style
    if (disabled) {
      baseStyle.push(styles.disabledContainer);
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    // Variant styles
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    }
    
    // Size styles
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }
    
    // Disabled style
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };
  
  return (
    <Pressable
      style={({ pressed }) => [
        ...getContainerStyle(),
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? colors.primary : colors.white} 
            style={styles.loader}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledContainer: {
    backgroundColor: colors.gray[200],
    borderColor: colors.gray[200],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  largeText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: colors.gray[500],
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  loader: {
    marginRight: 8,
  },
});