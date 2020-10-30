import React, { CSSProperties, PropsWithChildren } from "react";

interface ContainerBasicProps {
  className?: string;
  style?: CSSProperties;
}

const ContainerBasic = ({
  children,
  className = "",
  style,
}: PropsWithChildren<ContainerBasicProps>): JSX.Element => {
  return (
    <div className={`container-basic ${className}`} style={{ ...style }}>
      {children}
    </div>
  );
};

export default ContainerBasic;
