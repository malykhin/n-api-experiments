#include <napi.h>
#include "./module.h"
#include "./utils.cc"

napi_value Sort(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments, expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsArray()) {
    Napi::TypeError::New(env, "Wrong first argument, should be an array").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "Wrong second argument, should be a sort type number").ThrowAsJavaScriptException();
    return env.Null();
  }
  const Napi::Array inputArray = info[0].As<Napi::Array>();
  const int sortType = info[1].As<Napi::Number>().Uint32Value();

  unsigned int length = inputArray.Length();  
  unsigned int array[length];
  unsigned int i;

  for (i = 0; i < length; i++) {
    array[i] = inputArray[i].As<Napi::Number>().Uint32Value();
  }
  unsigned int *arrayPointer = &array[0];

  switch (sortType) {
    case BUBBLE_SORT:
      bubbleSort(arrayPointer, length);
      break;
    case QUICK_SORT:
      quickSort(arrayPointer, length);
      break;
    default:
      break;
  }
  Napi::Array outputArray = Napi::Array::New(env, length);
  for (i = 0; i < length; i++) {
    outputArray[i] = Napi::Number::New(env, double(array[i]));
  }
  return outputArray;
}

napi_value ToGrayScale(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments, expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Wrong first argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[1].IsString()) {
    Napi::TypeError::New(env, "Wrong second argument, should be a string").ThrowAsJavaScriptException();
    return env.Null();
  }
  cv::string inPath = info[0].As<Napi::String>().Utf8Value();
  cv::string outPath = info[1].As<Napi::String>().Utf8Value();
  toGrayScale(inPath, outPath);
  return Napi::Number::New(env, 1);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "sort"), Napi::Function::New(env, Sort));
  exports.Set(Napi::String::New(env, "toGrayScale"), Napi::Function::New(env, ToGrayScale));
  return exports;
}

NODE_API_MODULE(module, Init)
