import styled from "styled-components";

interface PageTitleProps {
  $paddingbottom?: string;
}

export const PageTitle = styled.span<PageTitleProps>`
  font-weight: 700;
  font-size: 30px;
  padding-bottom: ${(props) => props.$paddingbottom};
`;
