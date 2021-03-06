// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { getDefaultFeatureFlagValues } from '../../../../common/feature-flags';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DrawingController, VisualizationWindowMessage } from '../../../../injected/drawing-controller';
import { DrawingInitiator } from '../../../../injected/drawing-initiator';
import { IAssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { PropertyBags, VisualizationInstanceProcessorCallback } from '../../../../injected/visualization-instance-processor';

class DrawingControllerStub extends DrawingController {
    public processRequest(message: VisualizationWindowMessage) {}
}

describe('DrawingInitiatorTest', () => {
    let drawingControllerMock: IMock<DrawingController>;
    let processorMock: IMock<VisualizationInstanceProcessorCallback<PropertyBags, PropertyBags>>;
    let testObject: DrawingInitiator;

    beforeEach(() => {
        processorMock = Mock.ofInstance(() => null);
        drawingControllerMock = Mock.ofType(DrawingControllerStub, MockBehavior.Strict);
        testObject = new DrawingInitiator(drawingControllerMock.object);
    });

    function verifyAll() {
        processorMock.verifyAll();
        drawingControllerMock.verifyAll();
    }

    test('enableVisualization', () => {
        const type = -1 as VisualizationType;
        const configId = 'id';
        const selectorMap: DictionaryStringTo<IAssessmentVisualizationInstance> = {
            key1: {
                target: ['element1'],
                isVisible: true,
                isFailure: false,
                isVisualizationEnabled: false,
                html: 'test',
                ruleResults: null,
                identifier: 'some id',
            },
            key2: {
                target: ['element2'],
                isVisible: true,
                isFailure: false,
                isVisualizationEnabled: false,
                html: 'test',
                ruleResults: null,
                identifier: 'some id',
            },
        };

        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: type,
            isEnabled: true,
            elementResults: [
                {
                    isVisible: true,
                    isFailure: false,
                    isVisualizationEnabled: false,
                    html: 'test',
                    target: ['element1'],
                    targetIndex: 0,
                    ruleResults: null,
                    identifier: 'some id',
                },
                {
                    isVisible: true,
                    isFailure: false,
                    isVisualizationEnabled: false,
                    html: 'test',
                    target: ['element2'],
                    targetIndex: 0,
                    ruleResults: null,
                    identifier: 'some id',
                },
            ],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.enableVisualization(type, getDefaultFeatureFlagValues(), selectorMap, configId, processorMock.object);

        verifyAll();
    });

    test('disableVisualization', () => {
        const type = -1 as VisualizationType;
        const configId = 'id';
        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: type,
            isEnabled: false,
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };

        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.disableVisualization(type, getDefaultFeatureFlagValues(), configId);

        verifyAll();
    });

    test('enableVisualiztion: selectorMap is null', () => {
        const type = -1 as VisualizationType;
        const step = null;
        const featureFlagStoreData = {};

        drawingControllerMock.setup(x => x.processRequest(It.isAny())).verifiable(Times.never());

        testObject.enableVisualization(type, featureFlagStoreData, null, step, processorMock.object);

        verifyAll();
    });

    test('enableVisualization: selectorMap is empty', () => {
        const type = -1 as VisualizationType;
        const configId = 'id';

        const expectedvisualizationMessage: VisualizationWindowMessage = {
            visualizationType: type,
            isEnabled: true,
            elementResults: [],
            featureFlagStoreData: getDefaultFeatureFlagValues(),
            configId: configId,
        };
        setupProcessorMock();
        drawingControllerMock
            .setup(x => x.processRequest(It.isAny()))
            .callback(message => {
                expect(message).toEqual(expectedvisualizationMessage);
            })
            .verifiable();

        testObject.enableVisualization(type, getDefaultFeatureFlagValues(), {}, configId, processorMock.object);

        verifyAll();
    });

    function setupProcessorMock(): void {
        processorMock
            .setup(pm => pm(It.isAny()))
            .returns(instances => instances)
            .verifiable(Times.once());
    }
});
