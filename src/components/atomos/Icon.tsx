import styled from "styled-components";

interface IconProps {
  $color?: string;
}

export const Icon = styled.span<IconProps>`
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 20px;
  color: ${(props) => props.$color};
`;
