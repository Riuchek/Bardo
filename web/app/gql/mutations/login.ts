import { gql } from 'graphql-request';

export const loginMutation = gql`
  mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
      email
    }
  }
}
`;
