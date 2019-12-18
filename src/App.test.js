import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {Favorite} from './App';


Enzyme.configure({ adapter: new Adapter() })

describe("App component", () => {
  test('renders', () => {
    const wrapper = shallow(<App/>);
    expect(wrapper.exists()).toBe(true)
  });
  test('input text entered', () => {
    const wrapper = shallow(<App/>);
    wrapper.find("input").simulate("change", {
      target: {value: "test"}
    })
    expect(wrapper.find("input").props().value).toEqual("test")
  });
})
