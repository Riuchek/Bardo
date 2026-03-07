import { gql } from 'graphql-request';

export const registerMutation = gql`
  mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      username
      email
    }
  }
}
`;
