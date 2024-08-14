import GreyScale from "./components/Layout/GreyScale";
import GreyScaleHeader from "./components/Header/GreyScaleHeader";
import OsmAudit from "./components/Audit/OsmAudit";
import Explanation from "./components/Explaination/Explanation";
import Process from "./components/Process/Process";
import Contact from "./components/Contact/Contact";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'



function App() {
    return (
        <>
            <GreyScale>
                <GreyScaleHeader/>
                <Explanation/>
                <Process/>
                <OsmAudit/>
                <Contact/>
            </GreyScale>
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
}

export default App;
