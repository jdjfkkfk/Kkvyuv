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

  useEffect(() => {
    const episode = search.get('e');
    const season = search.get('s');

    if (episode || season) setType('series');

    // v = version
    // n = name
    // e = episode
    // s = season
    // o = origin

    let _params = `?v=${p.version}&n=${import.meta.env.VITE_APP_NAME}`;

    if (episode) _params += `&e=${episode}`;
    if (season) _params += `&s=${season}`;

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
        </div>

        <iframe allowFullScreen referrerPolicy="origin" title="Player" src={`${import.meta.env.VITE_APP_API}/embed/${type}/${id + params}`}></iframe>
      </div>
    </>
  );
}
