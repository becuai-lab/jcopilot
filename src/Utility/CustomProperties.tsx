import { CSSProperties } from 'styled-components';

interface CustomProperties extends CSSProperties {
  $isBold?: boolean;
  $isLeftButton?: boolean;
  $isActive?: boolean;
  $isVisible?: boolean;
  $isDisabled?: boolean;
  $isPrimary?: boolean;
  $isBorder?: boolean;
  $isFloat?: boolean;
  $isFlexStart?: boolean;
  $isButton?: boolean;
  $isReverse?: boolean;
  $isEllipsis?: boolean;

  $content?: string | null;
  $width?: string | number;
  $calcWidth?: string;
  $calcHeight?: string;
  $minWidth?: string;
  $maxWidth?: string;
  $size?: string;
  $fontSize?: string | number;
  $height?: string;
  $minHeight?: string;
  $zIndex?: number;
  $color?: string | number;
  $display?: string;
  $translatePosition?: string;
  $textAlign?: string;
  $padding?: string;
  $paddingNumber?: number;
  $marginTop?: string;
  $marginBottom?: string;
  $marginLeft?: string;
  $marginRight?: string;
  $positionTop?: number | string;
  $positionLeft?: number;
}

export default CustomProperties;
