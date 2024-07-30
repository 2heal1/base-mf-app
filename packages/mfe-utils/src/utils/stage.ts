/**
 * @deprecated Use mfe-api instead mfe-utils.
 */
export enum STAGE {
  DEV = "dev",
  STAGING = "staging",
  PRODUCTION = "production",
}

/**
 * @deprecated Use mfe-api instead mfe-utils.
 */
export const DEFAULT_STAGE = STAGE.DEV;

/**
 * @deprecated Use mfe-api instead mfe-utils.
 */
export const getStage = () => {
  const stageEnv = process.env.REACT_APP_STAGE?.toLowerCase();
  return (
    Object.values(STAGE).find((stage) => stage === stageEnv) || DEFAULT_STAGE
  );
};
