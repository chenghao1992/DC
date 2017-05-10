var serverApiRoot = '/kangzhe/',
    uploadApiRoot = '/upload/',
    imApiRoot = '/im/',
    medicineApiRoot = '/web/',
    drugFirmsApiRoot = '/org/',
    drugorgFirmsApiRoot = '/drugorg/',
    qiniuRoot = '/qiniuUrl/',
    qiniuIMRoot = '',
    imRoot = 'im',
    imWsRoot = 'im',
    sms = '/sms/';

(function() {
    var hostname = window.location.hostname,
        port = window.location.port;

    switch (hostname) {
        case 'localhost':
        case '127.0.0.1':
        case '192.168.3.38':
        case '192.168.3.36':
        case '192.168.3.46':
        case '192.168.3.51':
        case '192.168.3.66':
        case '192.168.3.78':
        case '192.168.3.40':
        case '192.168.3.47':
            switch (port) {
                case '8090':
                case '8083':
                    sms = 'http://112.74.208.140/smsService/';
                    serverApiRoot = 'http://112.74.208.140/health/';
                    uploadApiRoot = 'http://112.74.208.140/upload/';
                    imApiRoot = 'http://112.74.208.140/health/im/';
                    medicineApiRoot = 'http://112.74.208.140/web/';
                    drugFirmsApiRoot = 'http://112.74.208.140/org/';
                    break;
                case '8080':
                    medicineApiRoot = '/medicine/';
                //break;
                case '8082':
                    sms = 'http://120.24.94.126/smsService/';
                    serverApiRoot = 'http://120.24.94.126/health/';
                    uploadApiRoot = 'http://120.24.94.126/upload/';
                    medicineApiRoot = 'http://120.24.94.126/web/';
                    drugFirmsApiRoot = 'http://120.24.94.126/org/';
                    imApiRoot = 'http://120.24.94.126/health/im/';
                    qiniuRoot = 'http://vpan.test.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.test.file.dachentech.com.cn/';
                    imRoot = 'http://120.24.94.126/im/';
                    break;
                case '':
                case '80':
                case '81':
                case '8081':
                    sms = 'http://192.168.3.7/smsService/';
                    serverApiRoot = 'http://192.168.3.7/health/';
                    uploadApiRoot = 'http://192.168.3.7/upload/';
                    imApiRoot = 'http://192.168.3.7/health/im/';
                    medicineApiRoot = 'http://192.168.3.7/web/';
                    drugFirmsApiRoot = 'http://192.168.3.7/org/';
                    qiniuRoot = 'http://vpan.dev.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.dev.file.dachentech.com.cn/';
                    //imRoot = 'http://192.168.3.7/im/';
                    imRoot = '/im/';
                    imWsRoot = 'ws://192.168.3.7:8090/im/';
                    break;
                case '8888':
                    sms = 'http://192.168.3.64:8080/smsService/';
                    serverApiRoot = 'http://192.168.3.64:8080/health/';
                    uploadApiRoot = 'http://192.168.3.64:8080/upload/';
                    imApiRoot = 'http://192.168.3.64:8080/health/im/';
                    medicineApiRoot = 'http://192.168.3.64:8080/web/';
                    drugFirmsApiRoot = 'http://192.168.3.64:8080/org/';
                    qiniuRoot = 'http://vpan.dev.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.dev.file.dachentech.com.cn/';
                    //imRoot = 'http://192.168.3.7/im/';
                    imRoot = '/im/';
                    imWsRoot = 'ws://192.168.3.7:8090/im/';
                    break;
                default:
                    break;
            }
            break;
        case '192.168.3.41':
            switch (port) {
                case '8081':
                case '8082':
                    sms = '/vpn/smsService/';
                    serverApiRoot = '/vpn/health/';
                    uploadApiRoot = '/vpn/upload/';
                    imApiRoot = '/vpn/health/im/';
                    medicineApiRoot = '/vpn/web/';
                    drugFirmsApiRoot = '/vpn/org/';
                    qiniuRoot = 'http://vpan.dev.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.dev.file.dachentech.com.cn/';
                    //imRoot = 'http://192.168.3.7/im/';
                    imRoot = '/im/';
                    imWsRoot = 'ws://192.168.3.7:8090/im/';
                    break;
                default:
                    break;
            }
            break;
        default:
            sms = 'http://' + hostname + '/smsService/';
            serverApiRoot = 'http://' + hostname + '/health/';
            uploadApiRoot = 'http://' + hostname + '/upload/';
            imApiRoot = 'http://' + hostname + '/health/im/';
            medicineApiRoot = 'http://' + hostname + '/web/';
            drugFirmsApiRoot = 'http://' + hostname + '/org/';
            imRoot = 'http://' + hostname + '/im/';
            imWsRoot = 'ws://' + hostname + ':8090/im/';
            switch (hostname) {
                case '192.168.3.7':
                    qiniuRoot = 'http://vpan.dev.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.dev.file.dachentech.com.cn/';
                    qiniuPatientRoot = 'http://patient.dev.file.dachentech.com.cn/';
                    qiniuTelRecordRoot = 'http://telrecord.dev.file.dachentech.com.cn/';
                    break;
                case '120.24.94.126':
                    qiniuRoot = 'http://vpan.test.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.test.file.dachentech.com.cn/';
                    qiniuPatientRoot = 'http://patient.test.file.dachentech.com.cn/';
                    qiniuTelRecordRoot = 'http://telrecord.test.file.dachentech.com.cn/';
                    break;
                case '112.74.208.140':
                    qiniuRoot = 'http://vpan.file.dachentech.com.cn/';
                    qiniuIMRoot = 'http://message.file.dachentech.com.cn/';
                    qiniuPatientRoot = 'http://patient.file.dachentech.com.cn/';
                    qiniuTelRecordRoot = 'http://telrecord.file.dachentech.com.cn/';
                    break;
            }
    }
})
();
