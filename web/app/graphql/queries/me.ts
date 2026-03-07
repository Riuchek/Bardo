import { gql } from 'graphql-request';

export const meQuery = gql`
  query Me {
  me {
    id
    username
    email
  }
}
`;
