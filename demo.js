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
    iframe.style = "border: 2px solid red; height: 300px;";
  });

  PermissionsTunnel.onPermissionGranted(() => {
    alert("permission granted");
    iframe.style = "border: 2px solid green; height: 300px;";
  });

  console.log('registering callback');
  PermissionsTunnel.registerCallback('custom-event', msg => {
    console.log('msg', msg);
  });
};

const iframeSetup = async () => {
  const output = document.createElement("pre");
  document.body.appendChild(output);

  setInterval(() => {
    console.log('sending message to parent');
    PermissionsTunnel.sendMessageToParent('custom-event', {
      foo: Math.random()
    });
  }, 1000);

  const isPermissionGranted = await PermissionsTunnel.isPermissionGranted();
  if (!isPermissionGranted) {
    // request permission button
    const button = document.createElement("button");
    button.innerText = "Request permission";

    button.onclick = async () => {
      await PermissionsTunnel.requestPermission();

      PermissionsTunnel.onOrientationChange(event => {
        output.innerText = JSON.stringify(event, null, 2);
      });
    };

    // copy to clipboard button
    const copyButton = document.createElement("button");
    copyButton.innerText = "copy to clipboard";

    copyButton.onclick = async () => {
      PermissionsTunnel.writeText(Math.random());
    };

    document.body.appendChild(button);
    document.body.appendChild(copyButton);
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
