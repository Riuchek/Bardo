import { gql } from 'graphql-request';

export const worldQuery = gql`
  query World($id: ID!) {
  world(id: $id) {
    id
    name
    description
  }
}
`;
