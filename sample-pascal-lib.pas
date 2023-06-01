library SimpleLib;

uses classes;

function MySucc(AVal : Int64) : Int64; stdcall;
begin
  Result := System.Succ(AVal);
end;

function MyPred(AVal : Int64) : Int64; stdcall;
begin
  Result := System.Pred(AVal);
end;

function WriteToLog(var buffer: PAnsiChar;  var bufferSize: Integer): Boolean; stdcall;
var
  vStrm: TFileStream;
  vStr: string;
begin
   vStrm := TFileStream.Create('./log.txt', fmCreate);
  try
    try
      vStr := buffer;
      vStrm.Write(vStr[1], Length(vStr));
      //vStrm.Write(buffer, bufferSize); // write invalid string
      Result := true;

      vStr := '[Lib Pascal]: A Caça não é amanhã! É hoje.';
      buffer := PAnsiChar(vStr);
      bufferSize := Length(buffer);
    except
      Result := false;
    end;
  finally
    vStrm.Free();
  end;
end;


exports
  MySucc,
  MyPred,
  WriteToLog;
end.
