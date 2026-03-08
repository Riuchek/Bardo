import { gql } from 'graphql-request';

export const createWorldMutation = gql`
  mutation CreateWorld($name: String!, $description: String) {
  createWorld(name: $name, description: $description) {
    id
    name
    description
  }
}
`;
