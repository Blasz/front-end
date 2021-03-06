/* eslint-env jest */
import React from 'react';
import { mount, shallow } from 'enzyme';
import ReactGA from 'react-ga';
import createSnapshotTest from 'test-utils/createSnapshotTest';

import Button from '../Button';

describe('Button', () => {
  it('should render with required props', () => {
    createSnapshotTest(<Button>Test</Button>);
  });

  it('should render with many props assigned', () => {
    createSnapshotTest(
      <Button
        analyticsObject={{ action: 'Test Button Selected', category: 'Testing' }}
        className="test-class"
        disabled
        fullWidth
        onClick={jest.fn()}
        tabIndex={-1}
        theme="secondary"
        type="submit"
        data-id="test-id"
      >
        Test
      </Button>,
    );
  });

  it('should spread data- and aria- props', () => {
    const ariaProp = 'aria-label';
    const dataAttrProp = 'data-attr';

    const testProps = { [`${ariaProp}`]: 'test', [`${dataAttrProp}`]: 'test-attr' };

    const wrapper = shallow(<Button {...testProps}>Test</Button>);

    expect(wrapper.prop(ariaProp)).toStrictEqual('test');
    expect(wrapper.prop(dataAttrProp)).toStrictEqual('test-attr');
  });

  it('should should not spread an unexpected prop', () => {
    const attribute = 'fakey-data-prop';
    const testProps = { [`${attribute}`]: 'test' };

    const wrapper = shallow(<Button {...testProps}>Test</Button>);

    expect(wrapper.prop(attribute)).toBeUndefined();
  });

  it('should render without a generated span when children is PropTypes.node', () => {
    const testText = 'Testing No Span';

    const ButtonInstance = mount(
      <Button>
        <b>{testText}</b>
      </Button>,
    );

    expect(
      ButtonInstance.containsAnyMatchingElements([
        <span>{testText}</span>,
        <span>
          <b>{testText}</b>
        </span>,
      ]),
    ).toStrictEqual(false);
  });

  it('should render with a generated span when children is PropTypes.string', () => {
    const testText = 'Testing With Span';

    const ButtonInstance = mount(<Button>{testText}</Button>);

    expect(ButtonInstance.containsAllMatchingElements([<span>{testText}</span>])).toStrictEqual(
      true,
    );
  });

  it('should send log to console when clickHandler is called in non-prod environment', () => {
    /* eslint-disable no-console */
    console.log = jest.fn();

    const ButtonShallowInstance = shallow(<Button>Testing</Button>);

    ButtonShallowInstance.instance().clickHandler();

    expect(console.log.mock.calls).toHaveLength(1);
    /* eslint-enable no-console */
  });

  it('call props.onClick when button is clicked', () => {
    const onClickMock = jest.fn();
    const ButtonShallowInstance = shallow(<Button onClick={onClickMock}>Test</Button>);
    ButtonShallowInstance.instance().clickHandler();

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should call ReactGA when in prod environment', () => {
    /* eslint-disable no-console */
    ReactGA.initialize('foo', { testMode: true });

    process.env.NODE_ENV = 'production';

    const ButtonShallowInstance = shallow(<Button>Testing</Button>);

    ButtonShallowInstance.instance().clickHandler();

    expect(ReactGA.testModeAPI.calls).toContainEqual([
      'send',
      {
        eventAction: 'Button Selected',
        eventCategory: 'Interactions',
        hitType: 'event',
      },
    ]);
  });
});
