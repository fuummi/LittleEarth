import { useState } from "react";
import "./App.css";
import Main from "./components/Main/Main1";
import "@arco-design/web-react/dist/css/arco.css";
import { RecoilRoot } from "recoil";
function App() {
    return (
        <RecoilRoot>
            <Main></Main>
        </RecoilRoot>
    );
}

export default App;
