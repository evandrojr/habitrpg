import {
  createAndPopulateGroup,
  generateGroup,
  generateUser,
  requester,
} from '../../helpers/api.helper';

describe('POST /groups/:id/removeMember', () => {

  context('user is not member of the group', () => {
    it('returns an error');
  });

  context('user is a non-leader member of a guild', () => {
    it('returns an error');
  });

  context('user is the leader of a guild', () => {
    let api, leader, member, group;

    beforeEach((done) => {
      createAndPopulateGroup({
        members: 1,
        groupDetails: {
          name: 'test group',
          type: 'guild',
          privacy: 'public',
        },
      }).then((res) => {
        leader = res.leader;
        member = res.members[0];
        group = res.group;

        api = requester(leader);
        done();
      }).catch(done);
    });

    it('does not allow leader to remove themselves', (done) => {
      api.post(`/groups/${group._id}/removeMember`, null, {
        uuid: leader._id,
      }).then(done).catch((err) => {
        expect(err.code).to.eql(401);
        expect(err.text).to.eql('You cannot remove yourself!');
        done();
      });
    });

    it('can remove other members of guild', (done) => {
      api.post(`/groups/${group._id}/removeMember`, null, {
        uuid: member._id,
      }).then((res) => {
        return api.get(`/groups/${group._id}`);
      }).then((guild) => {
        expect(guild.members).to.have.a.lengthOf(1);
        expect(guild.members[0]._id).to.not.eql(member._id);
        done();
      }).catch(done);
    });
  });
});
