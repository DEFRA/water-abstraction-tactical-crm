const repos = require('../lib/repos');

const patchUnlinkLicence = async (request, h) => {
  try {
    return repos.docHeadersRepo.unlinkLicence(request.params.documentId);
  } catch (err) {
    if (err.isBoom) {
      return err;
    }
    throw err;
  }
};

exports.patchUnlinkLicence = patchUnlinkLicence;
