import {
  Grid, Radio, Image, Box, Stack, Title, Center,
} from '@mantine/core';
import { VLATQuestions } from './vlatQ';

interface FeedbackTrialProps {
  activeQuestionIdx: number;
  userAnswer: string;
  correctAnswer: string;
}
export default function FeedbackTrial({
  activeQuestionIdx,
  userAnswer,
  correctAnswer,
}: FeedbackTrialProps) {
  const activeQuestion = VLATQuestions.filter((q) => q.originID === activeQuestionIdx)[0];
  const images = import.meta.glob('../assets/vlatImg/*.png', { eager: true });
  const imgMap: Record<string, string> = {};

  for (const path in images) {
    if (path) {
      const fileName = path.split('/').pop()?.replace('.png', '') || '';
      const mod = images[path] as { default: string };
      imgMap[fileName] = mod.default;
    }
  }

  return (
    <Box>
      <Grid>
        <Grid.Col span={8}>
          <Image
            radius="sm"
            src={imgMap[activeQuestion.img]}
            alt="VIS"
            w="100%"
            maw={900}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Radio.Group
            name="question"
            label={activeQuestion.question}
            value={`${+userAnswer}`}
            size="md"
          >
            <Stack mt={20}>
              {
                    activeQuestion.options.map((op:string, idx:number) => (
                      <Radio
                        disabled
                        value={`${idx}`}
                        label={`${String.fromCharCode(65 + idx)}. ${op}`}
                        key={`op${idx}`}
                      />
                    ))
                  }
            </Stack>

          </Radio.Group>
        </Grid.Col>

      </Grid>
      <Center>
        <Title order={3}>
          The correct answer is
          {' '}
          {correctAnswer}
        </Title>
      </Center>
    </Box>
  );
}
