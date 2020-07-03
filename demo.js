import { PermissionsTunnel } from "./main.js";

const ready = function(cb) {
  // Check if the `document` is loaded completely
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", function(e) {
        cb();
      })
    : cb();
};

const isInIframe = (() => {
  try {
    return window.self !== window.parent;
  } catch (e) {
    return true;
  }
})();

window.onerror = error => alert(error);

const topSetup = () => {
  let iframe = document.getElementById("iframe");

  PermissionsTunnel.forwardTo(iframe.contentWindow);

  PermissionsTunnel.onPermissionPromptShown(() => {
    iframe.style = "border: 2px dashed black; width: 100%; height: 100%;";
  });

  PermissionsTunnel.onPermissionDenied(() => {
    alert("permission denied");
    iframe.style = "border: 2px solid red; height: 100px;";
  });

  PermissionsTunnel.onPermissionGranted(() => {
    alert("permission granted");
    iframe.style = "border: 2px solid green; height: 100px;";
  });
};

const iframeSetup = async () => {
  const output = document.createElement("pre");
  document.body.appendChild(output);

  const isPermissionGranted = await PermissionsTunnel.isPermissionGranted();

  if (!isPermissionGranted) {
    const button = document.createElement("button");
    button.innerText = "Request permission";

    button.onclick = async () => {
      await PermissionsTunnel.requestPermission();

      PermissionsTunnel.onOrientationChange(event => {
        output.innerText = JSON.stringify(event, null, 2);
      });
    };

    document.body.appendChild(button);
    PermissionsTunnel.notifyPermissionPromptIsShown();
  } else {
    PermissionsTunnel.onOrientationChange(event => {
      output.innerText = JSON.stringify(event, null, 2);
    });
  }
};

if (isInIframe) {
  ready(iframeSetup);
} else {
  ready(topSetup);
}
