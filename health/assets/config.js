var sms = '/vpn/smsService/',
    serverApiRoot = '/vpn/health/',
    eyeApiRoot='/vpn/eye/',
    uploadApiRoot = '/vpn/upload/',
    imApiRoot = '/vpn/health/im/',
    medicineApiRoot = '/vpn/web/',
    drugFirmsApiRoot = '/vpn/drug/',
    drugOrgApiRoot = '/vpn/drugorg/',
    qiniuRoot = '/vpn/qiniuRoot/',
    qiniuIMRoot = '/vpn/qiniuIMRoot/',
    qiniuPatientRoot = '/vpn/qiniuPatientRoot/',
    qiniuTelRecordRoot = '/vpn/qiniuTelRecordRoot/',
    imRoot = '/im/',
    imWsRoot = 'ws://192.168.3.7:8090/im/',
    signApiRoot = '/vpn/sign/',
    communityApiRoot = '/vpn/community/',
    qiniuUrl = 'file.dachentech.com.cn/',
    protocol = window.location.protocol + '//';

(function() {
    var hostname = window.location.hostname,
        port = window.location.port;

    switch (hostname) {
        case 'localhost':
            imWsRoot = 'ws://120.24.94.126:8090/im/';
            qiniuUrl = 'test.file.dachentech.com.cn/'
            break;
        default:
            sms = protocol + hostname + '/smsService/';
            serverApiRoot = protocol + hostname + '/health/';
            eyeApiRoot = protocol + hostname + '/eye/';
            uploadApiRoot = protocol + hostname + '/upload/';
            imApiRoot = protocol + hostname + '/health/im/';
            medicineApiRoot = protocol + hostname + '/web/';
            drugFirmsApiRoot = protocol + hostname + '/drug/';
            drugOrgApiRoot = protocol + hostname + '/drugorg/';
            imRoot = protocol + hostname + '/im/';
            imWsRoot = 'ws://' + hostname + ':8090/im/';
            signApiRoot = protocol + hostname + '/sign/';
            communityApiRoot = protocol + hostname + '/community/';
            switch (hostname) {
                case '192.168.3.7':
                    qiniuUrl = 'dev.file.dachentech.com.cn/'
                    break;
                case '120.24.94.126':
                case 'test.mediportal.com.cn':
                    qiniuUrl = 'test.file.dachentech.com.cn/';
                    break;
                case '112.74.208.140':
                case '120.25.84.65':
                    qiniuUrl = 'file.dachentech.com.cn/';
                    break;
            }

    }
    qiniuRoot = protocol + 'vpan.' + qiniuUrl;
    qiniuIMRoot = protocol + 'message.' + qiniuUrl;
    qiniuPatientRoot = protocol + 'patient.' + qiniuUrl;
    qiniuTelRecordRoot = protocol + 'telrecord.' + qiniuUrl;
})();
