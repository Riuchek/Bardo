import { gql } from 'graphql-request';

export const deleteWorldMutation = gql`
  mutation DeleteWorld($id: ID!) {
  deleteWorld(id: $id)
}
`;
