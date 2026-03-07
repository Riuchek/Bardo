import { gql } from 'graphql-request';

export const updateWorldMutation = gql`
  mutation UpdateWorld($id: ID!, $input: UpdateWorldInput!) {
  updateWorld(id: $id, input: $input) {
    id
    name
    description
  }
}
`;
