import Header from './components/Header';
import TensorFlowModel from './components/TensorFlowModel';
import ImageContextProvider from './contexts/ImageContextProvider';

function App() {
    return (
        <ImageContextProvider>
            <Header />
            <TensorFlowModel />
        </ImageContextProvider>
    );
}

export default App;
