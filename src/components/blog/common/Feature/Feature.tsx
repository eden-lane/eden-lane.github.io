import CheckIcon from "../icons/check.svg";
import { styled } from "styled-components";

type Props = {
  title: string;
  description?: string;
};

export const Feature = (props: Props) => {
  const { title, description } = props;

  return (
    <Root>
      <img alt="check icon" src={CheckIcon.src} />
      <div>{title}</div>
      {description && <Description>{description}</Description>}
    </Root>
  );
};

const Root = styled.li`
  display: grid;
  list-style: none;
  align-items: center;
  gap: 8px;
  padding: 0;
  margin-left: 0;
  grid-template-columns: auto 1fr;
`;

const Description = styled.div`
  grid-column: 2;
`;
