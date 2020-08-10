    /*
    **********************************************************************************
    * Aşağıdaki uygulama Organik API v.2 üzerinde geliştirilmiş bir uygulamadır.     *
    * Literal yapının istediğiniz prosedürlerini bağımsız olarak kullanabilir,       *
    * ihtiyacınıza göre gerekli şekilde uygulayabilirsiniz. Bu kütüphanenin          *
    * kullanılabilmesi için organikapi.js dosyasının include edilmiş olması gerekir. *
    * API hakkında bilgi almak için: http://www.organikapi.com adresini ziyaret edin.*
    * Yazar: Özgür GÜRÇKAYA / Organik Haberleşme Teknolojileri                       *
    * Organik Haberleşme Teknolojileri © 2017. Her hakkı saklıdır                    *
    **********************************************************************************
    */
    function Organikapi(init){
        this.API_KEY        = init ? (init.API_KEY          || null)   : (null); // Panelde API kullanıcısı oluşturduktan sonra size verilen anahtar değeri. DEĞİŞTİREBİLİRSİNİZ.
        this.HEADER_NAME    = init ? (init.HEADER_NAME      || null)   : (null); // Gönderim yapmak istediğiniz gönderen kimliği. DEĞİŞTİREBİLİRSİNİZ.
        this.MESSAGE        = init ? (init.MESSAGE          || null)   : (null); // Göndermek istediğiniz mesaj. DEĞİŞTİREBİLİRSİNİZ.
        this.HEADERS        = {}; // Kullanılabilir gönderen kimlikleri dizi şeklinde bu değişkene yüklenir. DEĞİŞTİREBİLİRSİNİZ.
        this.GROUPS         = {}; // Gönderim yapılabilecek kayıtlı gruplar bu değişkene yüklenir. DEĞİŞTİREBİLİRSİNİZ.
        this.GROUPIDS       = init ? (init.GROUPIDS         || null)   : (null); // Gönderim yapılacak grupların ID'leri bu değişkende saklanır. DEĞİŞTİREBİLİRSİNİZ.
        this.GSMS           = init ? (init.GSMS             || null)   : (null); // Gönderim yapılacak grupların içine dahil olmayan GSM numaraları bu değişkende saklnır. DEĞİŞTİREBİLİRSİNİZ.
        this.TIMEOUT        = init ? (init.TIMEOUT          || 48)     : (48);   // Gönderim işlemine başlandıktan sonra iletilmeyen iletilerin ne kadar zaman sonra iadesi gerçekleştiğini belirtir. Saat cinsindendir. DEĞİŞTİREBİLİRSİNİZ.
        this.DELIVERY_TIME  = init ? (init.DELIVERY_TIME    || null)   : (null); // Gönderim işleminin ileri bir tarihte ypaılması isteniyorsa YYYY-AA-GG SS:DD formatında buraya yazılır. DEĞİŞTİREBİLİRSİNİZ.
        this.TRACK_ID       = init ? (init.TRACK_ID         || null)   : (null); // Bu gönderim için kendi tarafınızda saklayabileceğiniz benzersiz ID değeridir. Zorunlu değildir. DEĞİŞTİREBİLİRSİNİZ.
        this.REPORT_URL     = init ? (init.REPORT_URL       || null)   : (null); // Bu gönderim için kendi tarafınızda saklayabileceğiniz benzersiz ID değeridir. Zorunlu değildir. DEĞİŞTİREBİLİRSİNİZ.
        this.IS_UNIQUE      = init ? (init.IS_UNIQUE        || 1)      : (1);    // Alıcıların içinde tekrarlanan numaralara gönderim işleminin yapılıp yapılmayacağını belirler. 1 ise tekrarlanan numaralara gönderim ypaılmaz, 0 ise yapılır.
        this.MESSAGE_FORMAT = init ? (init.MESSAGE_FORMAT   || 0)      : (0);    // Göndeirlecek mesajın tipini belirler. 0 - Normal, 1 - Türkçe, 2 - unicode measj tipidir. DEĞİŞTİREBİLİRSİNİZ
        this.CREDIT_BALANCE = 0;  // Hesabınızda bulunana toplam kredi miktarı
        this.TL_BALANCE     = 0;  // Hesabınızda bulunana toplam kredi miktarı
        this.API_VERSION    = 'v2/';// İstekler için kullanılan global değerdir, DEĞİŞTİRMEYİNİZ!
        this.API_URL        = 'https://organikapi.com/'; // İstekler için kullanılan global değerdir, DEĞİŞTİRMEYİNİZ!
        this.gMESSAGE       = '';
        this.IS_TEST        = init ? (init.IS_TEST          || false)  : (false);
        this.DEBUG_MODE     = init ? (init.DEBUG_MODE       || false)   : (false); // Console logları için global değişkendir. false olursa işlem bilgileri console'a gönderilmez.
        this.PRESULT        = {};
        this.ui             = { // form nesnelerinin içine yüklenceği değişken kümesidir.
            isIE    : false,
            elems   : {
                "HEADER"        : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'header'},
                "GROUPIDS"      : {el: null, use: ['smsviaget', 'sendsms', 'groups', 'groupcontent'], apiname: 'groupids'},
                "GSMS"          : {el: null, use: ['smsviaget', 'sendsms', 'blacklistadd', 'blacklist', 'blacklistremove'], apiname: 'gsms'},
                "MESSAGE"       : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'message'},
                "MESSAGE_FORMAT": {el: null, use: ['sendsms'], apiname: 'message_format'},
                "IS_UNIQUE"     : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'gsm_isunique'},
                "DELIVERY_TIME" : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'deliverytime'},
                "TIMEOUT"       : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'timeout'},
                "TRACK_ID"      : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'track_id'},
                "REPORT_URL"    : {el: null, use: ['smsviaget', 'sendsms'], apiname: 'report_url'},
                "SEND"          : {el: null, use: ['smsviaget', 'sendsms'], apiname: null}
            }
        };
        this.rtypes = { // fonskiyonlar çalıştıkça hangi metotla API'ye gideceği bilgisini buradan alır.
            GET  : ['balance','headers','smsviaget','groups','blacklist'], // bu prosedürler GET ile;
            POST : ['sendsms','detailedreport','basicreport','groupcontent','cancelscheduledtasks','blacklistadd','blacklistremove'] // bu prosedürler ise POST ile çalışır.
        };
        this.balance({
            async: true,
            select: 'balances'
        });
        this.setUI(); // Form inputlarının set edilmesi için gereklidir.
        this.f = {
            cd: function(d){
                if(d) {
                    if (!o.ui.isIE){
                        var tmpDate = d.replace('T', ' ');
                        var today = new Date(tmpDate);
                        if (!today) {
                            today = new Date(d);
                        };
                    }else {
                        var today = new Date(Date.parse(d));
                    };
                    var dd = today.getDate();
                    var mm = today.getMonth()+1;
                    var yyyy = today.getFullYear();
                    var hh = today.getHours();
                    var mn = today.getMinutes();
                    dd = dd < 10 ? ('0' + dd) : (dd);
                    mm = mm < 10 ? ('0' + mm) : (mm);
                    mn = mn < 10 ? ('0' + mn) : (mn);
                    hh = hh < 10 ? ('0' + hh) : (hh);
                    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn;
                }else{
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1;
                    var yyyy = today.getFullYear();
                    var hh = today.getHours();
                    var mn = today.getMinutes();
                    dd = dd < 10 ? ('0' + dd) : (dd);
                    mm = mm < 10 ? ('0' + mm) : (mm);
                    mn = mn < 10 ? ('0' + mn) : (mn);
                    hh = hh < 10 ? ('0' + hh) : (hh);
                    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn
                };
            },
            clearType: function() {
                var a = [],
                    o = {},
                    n = this.length;
                for (var i=0; i<n; ++i) {
                    var thisnumber=clearNumbers.setNumber(this[i]);
                    if (thisnumber){
                        o[this[i]] = thisnumber;
                    };
                };
                for (i in o) {
                    a.push(o[i]);
                };
                return a;
            }
        };
        return this;
    };
    Organikapi.prototype.debug = function(args){
        if(this.DEBUG_MODE){
            for(var i=0;i<args.length;i++){
                console[args[i][0]](args[i][1]);
            };
        };
    };
    Organikapi.prototype.APIREQ = function(params, callback) { // Tüm literal yapının kullandığı global API iletişim metodur. async" değişkeni ile asenkron ya da senkron çalışabilir. Ayrıca callback desteği vardır.
        var o = this;
        try {
            if(o.API_KEY||o.API_KEY.length!==32) {
                for (var p in params) { // API isteğinde parametreler içinde "process", "method" ve "async" değişkenleri tanımlanmış olmalıdır.
                    if (/process|method|async/.test(p)) {
                        if (typeof params[p] === "string") {
                            var val = params[p].toString().trim();
                            if (val == '' || val == undefined || val == null) {
                                o.gMESSAGE = 'Eksik ya da yanlış parametre tanımlaması: ' + p;
                                o.debug([
                                    ['warn', 'API istek prosedürü, yanlış argüman uyarısı:'],
                                    ['info', p]
                                ]);
                                if (callback) {
                                    callback(false);
                                }
                                return false;
                            }
                        };
                    };
                };
                if (params.responseType !== 'json') {
                    o.gMESSAGE = 'Yanıt gövdesi tipi parametresi hatalı';
                    return false;
                };

                if (window.XMLHttpRequest) {
                    var requestObject = new XMLHttpRequest();
                }else{
                    var requestObject = new ActiveXObject("Microsoft.XMLHTTP");
                };

                var requestAsync = typeof params.async === 'boolean' ? (params.async) : (true);
                if (requestAsync) { // asenkron yanıt tiplerinde responseType değişkenine göre değer alınır
                    requestObject.onreadystatechange = function () {
                        if (requestObject.readyState === XMLHttpRequest.DONE) {
                            if (requestObject.status == 200) {
                                if (callback) {
                                    var responseValue = params.responseType == 'json' ? (requestObject.response.response) : (requestObject.responseText);
                                    callback(responseValue); // Burada API'den dönen sonuç verisi daima "response" parent key ile gelir. Bu yüzden fonskiyonu çağıran metoda API yanıtı döndürmek için http request nesnesinin (response) içinden API'nin response değeri çağırılı.
                                    return responseValue;
                                } else {
                                    return responseValue;
                                }
                            } else {
                                o.gMESSAGE = 'API isteği başarısız oldu (' + requestObject.status + ')';
                                o.debug([
                                    ['error', 'Başarısız API isteği (' + requestObject.status + '). Şunlar talep edildi:'],
                                    ['info', JSON.stringify(params)]
                                ]);
                                if (callback) {
                                    callback(false);
                                    return false;
                                } else {
                                    return false;
                                };
                            };
                        };
                    };
                };
                if (requestAsync) { // asenkron isteklerde yanıt tipi parametresi çalıştırılır.
                    requestObject.responseType = params.responseType;
                };
                var pmethod = o.rtypes.POST.indexOf(params.process) > -1 ? ('POST') : ('GET');
                var formData = pmethod == 'POST' ? (params.data ? (JSON.stringify(params.data)) : (null)) : (null);
                var requestURL = o.API_URL + o.API_VERSION + o.API_KEY + '/' + params.process + '/';
                if(pmethod=='GET'&&params.data){
                    requestURL += '?' + params.data;
                };
                requestObject.open(pmethod, requestURL, requestAsync);
                requestObject.send(formData);
                if (!requestAsync) { // eğer istek senkron çalıştırılmışsa gelen yanıt mutlaka PARSE edilmelidir.
                    if (requestObject.status === 200) {
                        if (callback) {
                            var responseValue = JSON.parse(requestObject.responseText);
                            callback(responseValue.response);
                            return responseValue.response;
                        } else {
                            return responseValue.response;
                        };
                    } else {
                        o.gMESSAGE = 'API isteği başarısız oldu (' + requestObject.status + ')';
                        o.debug([
                            ['error', 'Başarısız API isteği (' + requestObject.status + '). Şunlar talep edildi:'],
                            ['info', JSON.stringify(params)]
                        ]);
                        if (callback) {
                            callback(false);
                            return false;
                        } else {
                            return false;
                        };
                    };
                };
            }else{
                o.debug([
                    ['warn', 'API istek prosedürü, yanlış argüman uyarısı:'],
                    ['info', 'API_KEY değeri boş ve 32 karakterden kısa/uzun olamaz']
                ]);
                if (callback) {
                    callback(false);
                }
            };
        }catch(err){
            o.gMESSAGE = 'API istek hatası: ' + err;
            o.debug([
                ['info', 'API istek hatası: '],
                ['log', err]
            ]);
            if (callback) {
                callback(false);
            }
        };
    };

    Organikapi.prototype.getAPIData = function(args, callback) {
        if(args){
            var input = args.select;
            var asyncFlag = args.async;
            var method = args.method;
        };
        var o = this;
        return o.APIREQ({
            process: method, // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
            responseType: 'json',    // API'nin yanıt tipi
            async: asyncFlag      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
        }, function (d) {
            if (!d) {
                alert(o.gMESSAGE);
                return false;
            }
            if (d.result) {
                switch(method){
                    case 'groups':
                        o.GROUPS = d;
                        var inputElement = document.getElementById(input), option;
                        if (inputElement) {
                            inputElement.innerHTML = '';
                            for (var i = 0; i < d.data.length; i++) {
                                option = document.createElement('option');
                                option.text = d.data[i].name + ' (' + d.data[i].count + ')';
                                option.value = d.data[i].id;
                                option.setAttribute('data-count', d.data[i].count);
                                inputElement.appendChild(option);
                            }
                        }else if(o.ui.elems.GROUPIDS.el){
                            if(o.ui.elems.GROUPIDS.el.type=='select-one'||o.ui.elems.GROUPIDS.el.type==='select-multiple'){
                                o.ui.elems.GROUPIDS.el.innerHTML = '';
                                for (var i = 0; i < d.data.length; i++) {
                                    option = document.createElement('option');
                                    option.text = d.data[i].name + ' (' + d.data[i].count + ')';
                                    option.value = d.data[i].id;
                                    option.setAttribute('data-count', d.data[i].count);
                                    o.ui.elems.GROUPIDS.el.appendChild(option);
                                };
                            };
                        };
                        if(callback){
                            callback(d);
                        };
                        break;
                    case 'headers':
                        o.HEADERS = d;
                        var inputElement = document.getElementById(input), option;
                        if (inputElement) {
                            inputElement.innerHTML = '';
                            for (var i = 0; i < d.data.length; i++) {
                                option = document.createElement('option');
                                option.text = d.data[i].name;
                                option.value = d.data[i].id;
                                inputElement.appendChild(option);
                            };
                        }else if(o.ui.elems.HEADER.el){
                            if(o.ui.elems.HEADER.el.type==='select-one') {
                                o.ui.elems.HEADER.el.innerHTML = '';
                                for (var i = 0; i < d.data.length; i++) {
                                    option = document.createElement('option');
                                    option.text = d.data[i].name ;
                                    option.value = d.data[i].id;
                                    option.setAttribute('data-count', d.data[i].count);
                                    o.ui.elems.HEADER.el.appendChild(option);
                                };
                            };
                        };
                        if(callback){
                            callback(d);
                        };
                        break;
                    case 'balance':
                        o.CREDIT_BALANCE = parseInt(d.data.credit);
                        o.TL_BALANCE = parseFloat(d.data.tl);
                        var inputElement = document.getElementById(input);
                        if (inputElement) {
                            inputElement.innerText = 'Kredi: ' + o.CREDIT_BALANCE + ' SMS / ' + 'TL: ' + o.TL_BALANCE + ' TL';
                        };
                        if(callback){
                            callback(d);
                        };
                        break;
                    case 'blacklist':
                        var inputElement = document.getElementById(input), option;
                        if (inputElement) {
                            inputElement.innerHTML = '';
                            for (var i = 0; i < d.data.length; i++) {
                                option = document.createElement('option');
                                option.text = d.data[i].gsm;
                                option.value = d.data[i].gsm;
                                inputElement.appendChild(option);
                            };
                        }else if(o.ui.elems.GSMS.el){
                            if(o.ui.elems.GSMS.el.type==='select-one'||o.ui.elems.GSMS.el.type==='select-multiple') {
                                o.ui.elems.GSMS.el.innerHTML = '';
                                for (var i = 0; i < d.data.length; i++) {
                                    option = document.createElement('option');
                                    option.text = d.data[i].gsm;
                                    option.value = d.data[i].gsm;
                                    //option.setAttribute('data-createdate', d.data[i].date);
                                    o.ui.elems.GSMS.el.appendChild(option);
                                };
                            };
                        };
                        if(callback){
                            callback(d);
                        };
                        break;
                }
            }else{
                o.debug([
                    ['group', 'API veri yükleme hatası:'],
                    ['info', 'İşlem: ' + method],
                    ['info', 'Hata mesajı: ' + d.error.message],
                    ['info', 'Hata kodu: ' + d.error.code],
                    ['info', 'Hata numarası: ' + d.error.number],
                    ['groupEnd', '']
                ]);
            };
        });
    };

    Organikapi.prototype.headers = function(args, callback) {
        var o = this;
        if(args){
            args.method = 'headers';
            args.async = args.async ? (args.async) : (false);
        }else{
            var args = {method: 'headers', async:false};
        };
        return o.getAPIData(args, callback);
    };

    Organikapi.prototype.groups = function(args, callback) {
        var o = this;
        if(args){
            args.method = 'groups';
            args.async = args.async ? (args.async) : (false);
        }else{
            var args = {method: 'groups', async:false};
        };
        return o.getAPIData(args, callback);
    };

    Organikapi.prototype.balance = function(args, callback) {
        var o = this;
        if(args){
            args.method = 'balance';
            args.async = args.async ? (args.async) : (false);
        }else{
            var args = {method: 'balance', async:false};
        };
        return o.getAPIData(args, callback);
    };

    Organikapi.prototype.blacklist = function(args, callback) {
        var o = this;
        if(args){
            args.method = 'blacklist';
            args.async = args.async ? (args.async) : (false);
        }else{
            var args = {method: 'blacklist', async:false};
        };
        return o.getAPIData(args, callback);
    };

    Organikapi.prototype.clearCustomGSMs = function() {
        var gsmInput = document.querySelectorAll('[data-role="GSMS"]');
        var el = document.getElementById(gsmInput[0].id);
        if(el){
            var GSMs = el.value;
            if(GSMs){
                GSMs = GSMs.replace(/[^0-9\,\n]+/g,'');
                GSMs = GSMs.replace(/,/gi,'\n');
                el.value = GSMs;
            };
        }else{
            o.debug([['warn', 'GSMS nesnesi bulunamadı']]);
        }
    };

    Organikapi.prototype.setUI = function() {
        var o = this;
        /*------ internet explorer içindeki takvim için -----*/
        var ie = (function(){
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );
            return v > 4 ? v : undef;
        }());
        o.ui.isIE = ie==9||ie==8||ie==7||ie==6 ? (true) : (o.ui.isIE);

        /*------ Diğeri alıcı GSM numara inputunun içerik değerlerinin temizlenemsi için kullanılır ----- */
        var gsmInput = document.querySelectorAll('[data-role="GSMS"]');
        if(gsmInput[0]){
            if(gsmInput[0].id) {
                if(gsmInput[0].type!=='select-one'&&gsmInput[0].type!=='select-multiple') {
                    document.getElementById(gsmInput[0].id).addEventListener('change', o.clearCustomGSMs);
                };
            };
        };
        /*------ Uygulama için form kullanılmışsa data-role attribute ile nesneler APP içine alınır ----- */
        var formElements = document.querySelectorAll('[data-role]');
        o.debug([['groupCollapsed', 'API Form Nesnesi Algılandı']]);
        for(i=0;i<formElements.length;i++){
            if(!o.ui.elems[formElements[i].getAttribute('data-role')].el) {
                o.ui.elems[formElements[i].getAttribute('data-role')].el = formElements[i];
                o.debug([['info', 'Role: ' + formElements[i].getAttribute('data-role')]]);
                o.debug([['info', 'Nesne: ' + formElements[i]]]);
                o.debug([['info', 'ID: ' + formElements[i].id]]);
                if(formElements[i].getAttribute('data-role')=='SEND'){
                    if(formElements[i].id){
                        var async = formElements[i].getAttribute('data-async') ? (formElements[i].getAttribute('data-async')) : (false);
                        async = typeof async === 'boolean' ? (async) : (false);
                        var sendtype = formElements[i].getAttribute('data-send') ? (formElements[i].getAttribute('data-send')) : ('sendsms'); // Varsayılan gönderim metodu sendsms'dir.
                        document.getElementById(formElements[i].id).addEventListener('click', function() {
                            o.send({async:async,process:sendtype})
                        });
                    }else{
                        o.debug([['info', 'Gönderim işlemi için form nesnesi tespit edilemedi.']]);
                    };
                };
            }else{
                o.debug([['warn', 'Form nesnesi daha önce atanmış: data-role: ' + formElements[i].getAttribute('data-role')]]);
            };
        };
        o.debug([['groupEnd', '']]);
    };

    Organikapi.prototype.checkBalance = function() {
        var o = this, totalRecipient = 0;
        if(o.GROUPIDS||o.GSMS){
            if(o.GROUPIDS){
                var g = o.GROUPIDS.split(',');
                for(i=0;i<g.length;i++){
                    for(j=0;j<o.GROUPS.data.length;j++){
                        if(g[i]==o.GROUPS.data[j].id){
                            totalRecipient += o.GROUPS.data[j].count;
                            break;
                        };
                    };
                };
            };
            if(o.GSMS){
                var n = o.GSMS.split(',');
                totalRecipient += n.length;
            };
            if(o.CREDIT_BALANCE>=totalRecipient){
                return true;
            }else{
                o.debug([['warn', 'İstenilen SMS gönderimi için yeterli kredi yok']]);
                return false;
            };
        }else{
            o.debug([['info', 'Alıcılar olmadan kredi kontrolü yapılamaz.']]);
            return false;
        };
    };

    Organikapi.prototype.collectAPIDatas = function(method) {
        var o = this;
        Object.keys(o.ui.elems).forEach(function(val) {
            if(val!=='SEND'){
                if(o.ui.elems[val].use.indexOf(method) > -1){
                    switch (o.ui.elems[val].el.type){
                        case 'select-one':
                            o[val] = o.ui.elems[val].el.options[o.ui.elems[val].el.selectedIndex].value ? (o.ui.elems[val].el.options[o.ui.elems[val].el.selectedIndex].value) : (null);
                            break;
                        case 'select-multiple':

                            var r = [];
                            for(i=0;i<o.ui.elems[val].el.options.length;i++) {
                                opt = o.ui.elems[val].el.options[i];
                                if(opt.selected) {
                                    r.push(opt.value);
                                };
                            };
                            o[val] = r ? (r.toString()) : (o[val]);

                            break;
                        case 'textarea':
                        case 'text':
                            if(val!=='GSMS'&&val!=='GROUPIDS'){
                                if(val!=='DELIVERY_TIME'){
                                    o[val] = o.ui.elems[val].el.value ? (o.ui.elems[val].el.value) : (o[val]);
                                }else{
                                    o[val] = o.ui.elems[val].el.value ? (o.f.cd(o.ui.elems[val].el.value)) : (o[val]); // Gönderim tarihini HTML5 desteklemeyen tarayıcıdan almak için
                                };
                            }else{
                                if(o.ui.elems[val].el.value){
                                    var txt = o.ui.elems[val].el.value.replace(/[^0-9]+/g, ',');
                                    var gsmsArr = txt.split(',');
                                    o[val] = gsmsArr.toString();
                                };
                            };
                            break;
                        case 'datetime-local':
                        case 'datetime':
                            o[val] = o.ui.elems[val].el.value ? (o.f.cd(o.ui.elems[val].el.value)) : (o[val]);
                            break;
                        default:
                            o[val] = o.ui.elems[val].el.value;
                            break;
                    };
                };
            };
        });
        switch(method){
            case 'smsviaget':
            case 'sendsms':
                if(o.MESSAGE){
                  o.MESSAGE = window.btoa(unescape(encodeURIComponent(o.MESSAGE))); // Gönderilen mesaj base64 formatında olmalıdır.
                };
                if(!o.HEADER&&o.ui.elems.HEADER.use.indexOf(method) > -1){
                    o.debug([['warn', 'Gönderen kimliği (başlık) boş olamaz.']]);
                    return false;
                };
                if(!o.GSMS&&!o.GROUPIDS&&o.ui.elems.GSMS.use.indexOf(method) > -1&&o.ui.elems.GROUPIDS.use.indexOf(method) > -1){
                    o.debug([['warn', 'Alıcı grubu seçili değilken GSM numaraları boş olamaz.']]);
                    return false;
                };
                if(!o.MESSAGE&&o.ui.elems.MESSAGE.use.indexOf(method) > -1){
                    o.debug([['warn', 'Mesaj metni boş olamaz.']]);
                    return false;
                };
                return true;
                break;
            case 'groupcontent':
                if(!o.GROUPIDS){
                    o.debug([['warn', 'Grup ID değeri boş olamaz.']]);
                    return false;
                };
                return true;
                break;
            case 'blacklistadd':
                if(!o.GSMS){
                    o.debug([['warn', 'Eklenecek numara yok.']]);
                    return false;
                };
                return true;
                break;
            case 'blacklistremove':
                if(!o.GSMS){
                    o.debug([['warn', 'Silinecek numara yok.']]);
                    return false;
                };
                return true;
                break;
        };
    };

    Organikapi.prototype.send = function(args, callback){
        var o = this, data = args.process == 'sendsms' ? ({}) : ('');
        if(o.ui.elems.SEND.el){
            o.ui.elems.SEND.el.setAttribute('disabled','disabled');
        };
        if(o.collectAPIDatas(args.process)){ // API için gerekli veri toplanır
            if(o.checkBalance()) { // minimum kredi kontrolü yapılır
                Object.keys(o.ui.elems).forEach(function (val) {
                    if (val !== 'SEND') {
                        if (o.ui.elems[val].use.indexOf(args.process) > -1) {
                            if(args.process=='smsviaget') {
                                data = data ? (data + '&' + o.ui.elems[val].apiname + '=' + o[val]) : (o.ui.elems[val].apiname + '=' + o[val]);
                            }else{
                                data[o.ui.elems[val].apiname] = o[val]; // API'ye gönderilecek nesne verisi burada oluşturulur.
                            };
                        }
                    }
                });
                if(args.process=='sendsms') {
                    var cdata = {
                        data : {
                            deliveries : [
                                {
                                    options: {
                                        header: o.HEADER ? (parseInt(o.HEADER)) : (null),
                                        delivery_time: o.DELIVERY_TIME,
                                        timeout: o.TIMEOUT ? (parseInt(o.TIMEOUT)) : (null),
                                        message_format: o.MESSAGE_FORMAT ? (parseInt(o.MESSAGE_FORMAT)) : (null),
                                        gsm_isUnique: o.IS_UNIQUE ? (parseInt(o.IS_UNIQUE)) : (null),
                                        track_id: o.TRACK_ID,
                                        report_url: o.REPORT_URL
                                    },
                                    recipients: {
                                        groups: o.GROUPIDS.split(','),
                                        gsms: o.GSMS.split(',')
                                    },
                                    message: o.MESSAGE
                                }
                            ]
                        }
                    };
                    data = cdata;
                };

                if(!o.IS_TEST){
                    return o.APIREQ({
                        process: args.process, // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                        responseType: 'json',    // API'nin yanıt tipi
                        async: args.async,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                        data: data
                    }, function (d) {
                        o.PRESULT = d;
                        if(d.result) {
                            var deliveryCount = d.data.deliveries.length;
                            var validDeliveryCount = 0, invalidaDeliveryCount = 0;
                            var APIResult = d.result ? ('Sağlandı') : ('Sağlanamadı');

                            for (i = 0; i < deliveryCount; i++) {
                                o.debug([['group', 'SMS Gönderimi Sonuçları']]);
                                o.debug([
                                    ['info', 'API İletişimi: ' + APIResult],
                                    ['info', 'Toplam Gönderim İşlemi: ' + deliveryCount],
                                    ['info', 'Gönderim ID: ' + d.data.deliveries[i].transaction_id],
                                    ['info', 'Başarılı Gönderim Sayısı: ' + d.data.deliveries[i].valid.length],
                                    ['info', 'Başarısız Gönderim Sayısı: ' + d.data.deliveries[i].invalid.length],
                                ]);
                                o.debug([['groupEnd', null]]);
                            };
                            if(args.update_balance){
                                o.balance({
                                    async: true,
                                    select: 'balances'
                                });
                            };
                            if(o.ui.elems.SEND.el){
                                o.ui.elems.SEND.el.removeAttribute('disabled');
                            };
                            if (callback) {
                                callback(d);
                            };
                        }else{
                            o.debug([['group', 'Hatalı API Sonucu:']]);
                            o.debug([
                                ['info', 'Mesaj: ' + d.error.message],
                                ['info', 'Hata Kodu: ' + d.error.code],
                                ['info', 'Hata Numarası: ' + d.error.number]
                            ]);
                            o.debug([['groupEnd', null]]);
                        };
                    });
                }else{
                    o.debug([['info', 'Sanal gönderim onaylandı.']]);
                    o.ui.elems.SEND.el.removeAttribute('disabled');
                };
            }else{
                o.debug([['error', 'Gönderim işlemi gerçekleştirilemedi: Yetersiz bakiye.']]);
                o.ui.elems.SEND.el.removeAttribute('disabled');
                return false;
            };
        }else{
            o.debug([['error', 'Gönderim işlemi gerçekleştirilemedi: Eksik ya da yanlış argüman.']]);
            o.ui.elems.SEND.el.removeAttribute('disabled');
            return false;
        };
    };

    Organikapi.prototype.smsviaget = function(args, callback) {
        var o = this;
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));
        args.async   = args ? (args.async ? (args.async) : (false)) : (false);
        args.update_balance = args ? (args.update_balance ? (args.update_balance) : (false)) : (false);
        args.process = 'smsviaget';
        return o.send(args, callback);
    };

    Organikapi.prototype.sendsms = function(args, callback) {
        var o = this;
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));
        args.async = args ? (args.async ? (args.async) : (false)) : (false);
        args.update_balance = args ? (args.update_balance ? (args.update_balance) : (false)) : (false);
        args.process = 'sendsms';
        return o.send(args, callback);
    };

    Organikapi.prototype.groupcontent = function(args, callback){
        var o = this,
        groupIDs    = args ? (args.group_ids) : ([]),
        asyncFlag   = args ? (args.async ? (args.async) : (false)) : (false);
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));
        if(typeof groupIDs==='object'){
            if(groupIDs.length>0){
                o.GROUPIDS = groupIDs.toString();
            }else{
                if(o.collectAPIDatas('groupcontent')){
                    groupIDs = o.GROUPIDS;
                };
            };
        }else{
            if(!groupIDs){
                if(o.collectAPIDatas('groupcontent')){
                    groupIDs = o.GROUPIDS;
                };
            }else{
                o.GROUPIDS = groupIDs.replace(/[^0-9]+/g,',');
            };
        };
        if(groupIDs) {
            return o.APIREQ({
                process: 'groupcontent', // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                responseType: 'json',    // API'nin yanıt tipi
                async: asyncFlag,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                data: {data: {group_ids: o.GROUPIDS.split(',')}}
            }, function(d) {
                if(callback){
                    callback(d);
                };
            });
        }else{
            o.debug([['warn', 'İçeriği istenecek bir grup bulunamadı.']]);
            return false;
        };
    };

    Organikapi.prototype.blacklistadd = function(args, callback){
        var o = this,
            gsms    = args ? (args.gsms) : ([]),
            asyncFlag   = args ? (args.async ? (args.async) : (false)) : (false);
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));
        if(typeof gsms==='object'){
            if(gsms.length>0){
                o.GSMS = gsms.toString();
            }else{
                if(o.collectAPIDatas('blacklistadd')){
                    gsms = o.GSMS;
                };
            };
        }else{
            if(!gsms){
                if(o.collectAPIDatas('blacklistadd')){
                    gsms = o.GSMS;
                };
            }else{
                o.GSMS = gsms.replace(/[^0-9]+/g,',');
            };
        };
        if(gsms) {
            return o.APIREQ({
                process: 'blacklistadd', // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                responseType: 'json',    // API'nin yanıt tipi
                async: asyncFlag,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                data: {data: {gsms: o.GSMS.split(',')}}
            }, function(d) {
                if(callback){
                    callback(d);
                };
            });
        }else{
            o.debug([['warn', 'Eklenecek bir numara bulunamadı.']]);
            return false;
        };
    };

    Organikapi.prototype.blacklistremove = function(args, callback){
        var o = this,
            gsms    = args ? (args.gsms) : ([]),
            asyncFlag   = args ? (args.async ? (args.async) : (false)) : (false);
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));
        if(typeof gsms==='object'){
            if(gsms.length>0){
                o.GSMS = gsms.toString();
            }else{
                if(o.collectAPIDatas('blacklistremove')){
                    gsms = o.GSMS;
                };
            };
        }else{
            if(!gsms){
                if(o.collectAPIDatas('blacklistadd')){
                    gsms = o.GSMS;
                };
            }else{
                o.GSMS = gsms.replace(/[^0-9]+/g,',');
            };
        };
        if(gsms) {
            return o.APIREQ({
                process: 'blacklistremove', // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                responseType: 'json',    // API'nin yanıt tipi
                async: asyncFlag,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                data: {data: {gsms: o.GSMS.split(',')}}
            }, function(d) {
                if(callback){
                    callback(d);
                };
            });
        }else{
            o.debug([['warn', 'Silinecek bir numara bulunamadı.']]);
            return false;
        };
    };

    Organikapi.prototype.basicreport = function(args, callback){
        var o = this,
            delivery_track_ids    = args ? (args.delivery_track_ids) : ([]),
            transaction_ids    = args ? (args.transaction_ids) : ([]),
            gsm_track_ids    = args ? (args.gsm_track_ids) : ([]),
            asyncFlag   = args ? (args.async ? (args.async) : (false)) : (false),
            availableGSMTrackIDS = [];
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));

        delivery_track_ids = typeof delivery_track_ids!=='object' ? (delivery_track_ids.replace(/[^0-9]+/g,',')) : (delivery_track_ids.toString());
        transaction_ids = typeof transaction_ids!=='object' ? (transaction_ids.replace(/[^0-9]+/g,',')) : (transaction_ids.toString());
        gsm_track_ids = typeof gsm_track_ids!=='object' ? (gsm_track_ids.split(',')) : (gsm_track_ids);

        for(var i=0;i<gsm_track_ids.length;i++){
            if(/[((\d{1,11})\-(\d{1,6})\-(\d{1,20}))]/.test(gsm_track_ids[i])){
                availableGSMTrackIDS.push(gsm_track_ids[i]);
            };
        };

        if(delivery_track_ids||transaction_ids||gsm_track_ids) {
            return o.APIREQ({
                process: 'basicreport', // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                responseType: 'json',    // API'nin yanıt tipi
                async: asyncFlag,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                data: {data: {
                    delivery_track_ids: delivery_track_ids.split(','),
                    transaction_ids: transaction_ids.split(','),
                    gsm_track_ids: availableGSMTrackIDS
                }}
            }, function(d) {
                if(callback){
                    callback(d);
                };
            });
        }else{
            o.debug([['warn', 'Rapor çekmek için en az bir parametreyi göndermelisiniz.']]);
            return false;
        };
    };

    Organikapi.prototype.detailedreport = function(args, callback){
        var o = this,
            delivery_track_ids    = args ? (args.delivery_track_ids) : ([]),
            transaction_ids    = args ? (args.transaction_ids) : ([]),
            gsm_track_ids    = args ? (args.gsm_track_ids) : ([]),
            asyncFlag   = args ? (args.async ? (args.async) : (false)) : (false),
            availableGSMTrackIDS = [];
        callback = typeof args === 'function' ? (args) : (callback ? (callback) : (null));

        delivery_track_ids = typeof delivery_track_ids!=='object' ? (delivery_track_ids.replace(/[^0-9]+/g,',')) : (delivery_track_ids.toString());
        transaction_ids = typeof transaction_ids!=='object' ? (transaction_ids.replace(/[^0-9]+/g,',')) : (transaction_ids.toString());
        gsm_track_ids = typeof gsm_track_ids!=='object' ? (gsm_track_ids.split(',')) : (gsm_track_ids);

        for(var i=0;i<gsm_track_ids.length;i++){
            if(/[((\d{1,11})\-(\d{1,6})\-(\d{1,20}))]/.test(gsm_track_ids[i])){
                availableGSMTrackIDS.push(gsm_track_ids[i]);
            };
        };

        if(delivery_track_ids||transaction_ids||gsm_track_ids) {
            return o.APIREQ({
                process: 'detailedreport', // API'nin çalıştırılmak istenen prosedürü, BOŞ OLAMAZ!
                responseType: 'json',    // API'nin yanıt tipi
                async: asyncFlag,      // Yapılan işlem senkron mu yoksa asenkron mu?, BOŞ OLAMAZ!
                data: {data: {
                    delivery_track_ids: delivery_track_ids.split(','),
                    transaction_ids: transaction_ids.split(','),
                    gsm_track_ids: availableGSMTrackIDS
                }}
            }, function(d) {
                if(callback){
                    callback(d);
                };
            });
        }else{
            o.debug([['warn', 'Rapor çekmek için en az bir parametreyi göndermelisiniz.']]);
            return false;
        };
    };
