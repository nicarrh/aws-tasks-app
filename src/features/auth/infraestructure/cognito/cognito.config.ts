import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const poolData = {
	UserPoolId: 'us-east-1_ArOBWZ8lA',
	ClientId: '2njpae6p8qci6uhh44eumgsh3r',
};

export const userPool = new CognitoUserPool(poolData);
