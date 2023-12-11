/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import p from '@/../package.json';

import MediaType from '@/types/MediaType';

export default function Watch() {
  const nav = useNavigate();

  const { id } = useParams();

  const [search] = useSearchParams();

  const [type, setType] = useState<MediaType>('movie');
  const [params, setParams] = useState<string>('');
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [maxEpisodes, setMaxEpisodes] = useState<number>(0);

  useEffect(() => {
    const episode = search.get('e');
    const season = search.get('s');
    const maxEpisodes = search.get('me');

    let _params = `?v=${p.version}&n=${import.meta.env.VITE_APP_NAME}`;

    if (episode && season) {
      setType('series');

      _params += `&s=${season}&e=${episode}`;

      setSeason(parseInt(season));
      setEpisode(parseInt(episode));

      if (maxEpisodes) {
        setMaxEpisodes(parseInt(maxEpisodes));
      }
    }

    if (window.location.origin) _params += `&o=${encodeURIComponent(window.location.origin)}`;

    setParams(_params);
  }, [id, search]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Watch - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="player">
        <div className="player-controls">
          <i className="fa-regular fa-arrow-left" onClick={() => nav(-1)}></i>

          <i className="fa-regular fa-home" onClick={() => nav('/')}></i>

          {type === 'series' && episode < maxEpisodes && <i className="fa-regular fa-forward-step right" onClick={() => nav(`/watch/${id}?s=${season}&e=${episode + 1}&me=${maxEpisodes}`)}></i>}
        </div>

        <iframe allowFullScreen referrerPolicy="origin" title="Player" src={`${import.meta.env.VITE_APP_API}/embed/${type}/${id + params}`}></iframe>
      </div>
    </>
  );
}
