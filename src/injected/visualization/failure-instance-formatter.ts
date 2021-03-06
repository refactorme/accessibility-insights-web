// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResultsWithFrameLevel, IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { Formatter } from './formatter';

export abstract class FailureInstanceFormatter implements Formatter {
    public static failureBoxConfig = {
        background: '#CC0000',
        fontColor: '#FFFFFF',
        text: '!',
        boxWidth: '20px',
    };

    public abstract getDrawerConfiguration(element: Node, data: AxeResultsWithFrameLevel): any;

    public abstract getDialogRenderer();

    protected getFailureBoxConfig(data: IAssessmentVisualizationInstance) {
        if (data && data.isFailure) {
            return FailureInstanceFormatter.failureBoxConfig;
        }

        return null;
    }
}
