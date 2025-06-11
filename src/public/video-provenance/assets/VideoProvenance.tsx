import { useEffect, useMemo, useRef } from 'react';
import { initializeTrrack, Registry } from '@trrack/core';
import { StimulusParams } from '../../../store/types';

type PlayStateModel ='paused' | 'playing' | 'stopped';
interface ProvenanceStateModel {
  all: {
    currentTime: number;
    playState: PlayStateModel;
  }
}

export default function VideoProvenance(props: StimulusParams<unknown, ProvenanceStateModel>) {
  const { provenanceState, setAnswer } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  const { actions, trrack } = useMemo(() => {
    const reg = Registry.create();

    const trackCurrentTime = reg.register('trackCurrentTime', (state, currentTime: number) => {
      state.all.currentTime = currentTime;
      return state;
    });

    const trackPlayState = reg.register('trackPlayState', (state, playState: PlayStateModel) => {
      state.all.playState = playState;
      return state;
    });

    const trrackInst = initializeTrrack({
      registry: reg,
      initialState: {
        all: {
          currentTime: 0,
          playState: 'paused',
        },
      },
    });

    return {
      actions: {
        trackCurrentTime,
        trackPlayState,
      },
      trrack: trrackInst,
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (provenanceState?.all.currentTime) {
        videoRef.current.currentTime = provenanceState?.all.currentTime;
      }
      if (provenanceState?.all.playState) {
        if (provenanceState.all.playState === 'paused') {
          videoRef.current?.pause();
        } else if (provenanceState.all.playState === 'playing') {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      }
    }
  }, [provenanceState]);

  useEffect(() => {
    if (videoRef.current) {
      const elem = videoRef.current;

      const handlePlayEvent = () => {
        trrack.apply('Play', actions.trackCurrentTime(elem.currentTime));
        trrack.apply('Play', actions.trackPlayState('playing'));
        setAnswer({
          status: true,
          provenanceGraph: trrack.graph.backend,
          answers: {},
        });
      };

      const handlePauseEvent = () => {
        trrack.apply('Pause', actions.trackCurrentTime(elem.currentTime));
        trrack.apply('Pause', actions.trackPlayState('paused'));
        setAnswer({
          status: true,
          provenanceGraph: trrack.graph.backend,
          answers: {},
        });
      };

      const handleSeekedEvent = () => {
        trrack.apply('Seeked', actions.trackCurrentTime(elem.currentTime));
        setAnswer({
          status: true,
          provenanceGraph: trrack.graph.backend,
          answers: {},
        });
      };

      elem.addEventListener('play', handlePlayEvent);
      elem.addEventListener('pause', handlePauseEvent);
      elem.addEventListener('seeked', handleSeekedEvent);

      return () => {
        elem.removeEventListener('play', handlePlayEvent);
        elem.removeEventListener('pause', handlePauseEvent);
        elem.removeEventListener('seeked', handleSeekedEvent);
      };
    }

    return () => {};
  }, [actions, trrack, setAnswer]);

  return (
    <div>
      <video controls width="100%" ref={videoRef}>
        <source src="./assets/video-sample.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
