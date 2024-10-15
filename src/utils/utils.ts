export function getUrlParam(param: string) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // console.log("url", urlParams.get(param));
  return urlParams.get(param);
}
