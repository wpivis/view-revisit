import {
  Group, Text, Title, Center, Card, ColorSwatch, Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { StimulusParams } from '../../../store/types';
import FeedbackTrial from './FeedbackTrial';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Feedback({ answers }: StimulusParams<any>) {
  const taskid = 'vlatResp';

  const topAnswer = Object.entries(answers)
    .filter(([key, _]) => key.startsWith('dynamicBlock'))
    .filter(([_, value]) => value.endTime > -1);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentCheck, setCurrentCheck] = useState<number>(0);

  const score = +topAnswer[topAnswer.length - 1][1].answer.score;
  let correctNum = 0;
  // const correctRecord = topAnswer.map((item) => {
  //   const ans = item[1].answer[taskid];
  //   const correctAns = item[1].correctAnswer[0].answer;
  //   if (ans === correctAns) correctNum += 1;
  //   return ans === correctAns;
  // });
  const openTrialCheck = (idx: number) => {
    setCurrentCheck(idx);
    open();
  };

  const replayRecord = topAnswer.map((item) => {
    const ans = item[1].answer[taskid];
    const correctAns = item[1].correctAnswer[0].answer;
    const activeQidx = item[1].parameters.activeQuestionIdx;
    const correct = ans === correctAns;
    if (correct) correctNum += 1;
    return {
      activeQidx,
      ans,
      correctAns,
      correct,
    };
  });

  // console.log(topAnswer, 'topAnswer');

  return (
    <>
      <Center>
        <Title>
          Your score is
          {' '}
          {+score.toFixed(2)}
        </Title>
      </Center>
      <Center>
        <Card w={600}>
          <Title order={4} mb={20}>
            You got
            {' '}
            {correctNum}
            {' '}
            correct out of
            {' '}
            {topAnswer.length}
            {' '}
            questions. Here is your record (Click each circle to check the question):
          </Title>
          <Group>
            {replayRecord.map((record, idx) => (
              <ColorSwatch style={{ cursor: 'pointer' }} key={`circle${idx}`} color={record.correct ? 'green' : 'red'} onClick={() => openTrialCheck(idx)} />
            ))}
          </Group>
          <Text mt={20} size="sm" c="grey">*This score is based on an adaptive testing methodology and cannot be mapped to 0-1 or 0-100. Instead, it can be used to compare runs between yourself or with other peoples’ scores.</Text>
        </Card>
      </Center>
      <Modal opened={opened} onClose={close} size="auto" title="">
        <FeedbackTrial activeQuestionIdx={replayRecord[currentCheck].activeQidx} userAnswer={replayRecord[currentCheck].ans} correctAnswer={replayRecord[currentCheck].correctAns} />
      </Modal>

    </>
  );
}
