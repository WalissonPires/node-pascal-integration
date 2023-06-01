const path = require('path');
const ffi = require('ffi-napi');
const ref = require('ref-napi');
const wchar_t = require('ref-wchar-napi');

const wchar = wchar_t.string;
const wcharPtr = ref.refType(wchar);
const LPCWSTR  = ref.refType(wcharPtr);
const PWideChar = LPCWSTR;

try {
	console.log('[Start]');

	const libaryPath = path.resolve(__dirname, 'libsample-pascal-lib.so');
	const lib = ffi.Library(libaryPath, {
	    MySucc: [ ffi.types.int64, [ ffi.types.int64 ] ],
	    MyPred: [ ffi.types.int64, [ ffi.types.int64 ] ],
	    WriteToLog: [ ffi.types.bool, [ ffi.types.CString, ref.refType(ffi.types.int32) ] ],
	});

	const result1 = lib.MySucc(10);
	console.log("result1: " + result1);

	const result2 = lib.MyPred(10);
	console.log("result2: " + result2);

	const { result: result3, strReceveid } = callStrMethod(lib, 'WriteToLog', '[Node]: A Caça é amanhã?');
	console.log("result3: " + result3);
	console.log("lib output: " + strReceveid + ";");

	console.log('[End]');
}
catch (error) {

	console.log(error.message);
}

function callStrMethod(lib, methodName, strInput) {

	const charset = 'utf8';
	const charsetBytesSize = 4;

	const resultStringMaxLenth = Math.max((strInput?.length ?? 0) + 1, 50);
	const bufferSize = charsetBytesSize * resultStringMaxLenth;
	const bufferSizeRef = ref.alloc(ffi.types.int32, bufferSize);

	const strBuffer = Buffer.alloc(bufferSize, '\0', charset);

	if (strInput)
		strBuffer.write(strInput, charset);

	const strBufferPtr = ref.alloc(PWideChar, strBuffer);

	const result = lib[methodName](strBufferPtr, bufferSizeRef);


	const bufferSizeRecevied = bufferSizeRef.deref();
        const strBufferReceveid = ref.reinterpretUntilZeros(strBufferPtr.deref(), charsetBytesSize ?? 0);
        const strReceveid = strBufferReceveid.toString(charset, 0, bufferSizeRecevied - 1);

	return {
		result,
		strReceveid
	};

}