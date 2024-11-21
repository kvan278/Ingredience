exports.getFileContentType = (filename) => {
    const ext = filename.split('.').pop();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'mp4':
            return 'video/mp4';
        case 'mov':
            return 'video/quicktime';
        case 'avi':
            return 'video/x-msvideo';
        case 'pdf':
            return 'application/pdf';
        case 'wav':
            return 'audio/wav';
        case 'mp3':
            return 'audio/mpeg';
        default:
            return 'application/octet-stream';
    }
};
