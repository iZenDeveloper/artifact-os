// Content plan view (demo). A team content scheduling calendar — UC-9b.
//
// This is a review-only demo surface: a Canva/Notion-style weekly content
// calendar that team operations use to plan & schedule published content
// (公众号 / 小红书 / X / 视频号). It is intentionally static: the "新建内容"
// button and the 周/月 view switch are presentational only. All data below is
// hard-coded Chinese mock data, deliberately not wired to i18n or a backend.

import { useState } from 'react';
import { Icon } from './Icon';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';

// Shared mock team members (kept consistent with RecentProjectsStrip.tsx).
// name is resolved for display via t(); nameKey is a stable id.
type MemberId = 'qiong' | 'zhangwei' | 'lina' | 'wangfang' | 'chenming' | 'liuyang';
const MEMBERS: Record<MemberId, { nameKey: keyof Dict; initial: string; img: string }> = {
  qiong: { nameKey: 'demo.ContentPlanView.tsx.member.qiong', initial: '琼', img: '/team-avatars/a2.png' },
  zhangwei: { nameKey: 'demo.ContentPlanView.tsx.member.zhangwei', initial: '张', img: '/team-avatars/a1.png' },
  lina: { nameKey: 'demo.ContentPlanView.tsx.member.lina', initial: '李', img: '/team-avatars/a3.png' },
  wangfang: { nameKey: 'demo.ContentPlanView.tsx.member.wangfang', initial: '王', img: '/team-avatars/a4.png' },
  chenming: { nameKey: 'demo.ContentPlanView.tsx.member.chenming', initial: '陈', img: '/team-avatars/a6.png' },
  liuyang: { nameKey: 'demo.ContentPlanView.tsx.member.liuyang', initial: '刘', img: '/team-avatars/a7.png' },
};

type Channel = 'wechat' | 'xhs' | 'x' | 'video';
const CHANNEL_LABEL_KEY: Record<Channel, keyof Dict> = {
  wechat: 'demo.ContentPlanView.tsx.channel.wechat',
  xhs: 'demo.ContentPlanView.tsx.channel.xhs',
  x: 'demo.ContentPlanView.tsx.channel.x',
  video: 'demo.ContentPlanView.tsx.channel.video',
};

type CardStatus = 'draft' | 'review' | 'scheduled' | 'published';
const STATUS_LABEL_KEY: Record<CardStatus, keyof Dict> = {
  draft: 'demo.ContentPlanView.tsx.status.draft',
  review: 'demo.ContentPlanView.tsx.status.review',
  scheduled: 'demo.ContentPlanView.tsx.status.scheduled',
  published: 'demo.ContentPlanView.tsx.status.published',
};

interface ContentCard {
  channel: Channel;
  titleKey: keyof Dict;
  status: CardStatus;
  owner: MemberId;
}

// Week column headers (周一~周日) with their dates (6/23 ~ 6/29).
const WEEK_DAYS: { weekdayKey: keyof Dict; date: string; today?: boolean }[] = [
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.mon', date: '6/23' },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.tue', date: '6/24', today: true },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.wed', date: '6/25' },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.thu', date: '6/26' },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.fri', date: '6/27' },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.sat', date: '6/28' },
  { weekdayKey: 'demo.ContentPlanView.tsx.weekday.sun', date: '6/29' },
];

// 0~2 cards per day, spread across the week (7 cards total).
const WEEK_CARDS: ContentCard[][] = [
  // 周一
  [
    { channel: 'wechat', titleKey: 'demo.ContentPlanView.tsx.card.releaseTeaser', status: 'scheduled', owner: 'zhangwei' },
  ],
  // 周二
  [
    { channel: 'xhs', titleKey: 'demo.ContentPlanView.tsx.card.dsComponentShots', status: 'review', owner: 'lina' },
    { channel: 'x', titleKey: 'demo.ContentPlanView.tsx.card.changelogDigest', status: 'draft', owner: 'chenming' },
  ],
  // 周三
  [
    { channel: 'video', titleKey: 'demo.ContentPlanView.tsx.card.quickStart30s', status: 'draft', owner: 'wangfang' },
  ],
  // 周四
  [],
  // 周五
  [
    { channel: 'wechat', titleKey: 'demo.ContentPlanView.tsx.card.dsLaunchAnnounce', status: 'scheduled', owner: 'qiong' },
    { channel: 'xhs', titleKey: 'demo.ContentPlanView.tsx.card.paletteInspo', status: 'review', owner: 'liuyang' },
  ],
  // 周六
  [],
  // 周日
  [
    { channel: 'x', titleKey: 'demo.ContentPlanView.tsx.card.communityWeekly18', status: 'published', owner: 'chenming' },
  ],
];

export function ContentPlanView() {
  const t = useT();
  // Presentational-only view switch; defaults to "周".
  const [range, setRange] = useState<'week' | 'month'>('week');

  return (
    <section className="content-plan">
      <header className="content-plan__head">
        <div className="content-plan__head-text">
          <h1 className="content-plan__title">{t('demo.ContentPlanView.tsx.title')}</h1>
          <p className="content-plan__subtitle">{t('demo.ContentPlanView.tsx.subtitle')}</p>
        </div>
        <div className="content-plan__head-actions">
          <div className="content-plan__range" role="group" aria-label={t('demo.ContentPlanView.tsx.viewSwitch')}>
            <button
              type="button"
              className={`content-plan__range-btn${range === 'week' ? ' is-active' : ''}`}
              aria-pressed={range === 'week'}
              onClick={() => setRange('week')}
            >
              {t('demo.ContentPlanView.tsx.range.week')}
            </button>
            <button
              type="button"
              className={`content-plan__range-btn${range === 'month' ? ' is-active' : ''}`}
              aria-pressed={range === 'month'}
              onClick={() => setRange('month')}
            >
              {t('demo.ContentPlanView.tsx.range.month')}
            </button>
          </div>
          <button type="button" className="content-plan__new">
            <Icon name="plus" size={15} />
            {t('demo.ContentPlanView.tsx.newContent')}
          </button>
        </div>
      </header>

      <div className="content-plan__calendar" role="grid" aria-label={t('demo.ContentPlanView.tsx.calendarLabel')}>
        {WEEK_DAYS.map((day, index) => {
          const cards = WEEK_CARDS[index] ?? [];
          return (
            <div
              key={day.weekdayKey}
              className={`content-plan__col${day.today ? ' is-today' : ''}`}
              role="gridcell"
            >
              <div className="content-plan__col-head">
                <span className="content-plan__col-weekday">{t(day.weekdayKey)}</span>
                <span className="content-plan__col-date">{day.date}</span>
              </div>
              <div className="content-plan__col-body">
                {cards.map((card, cardIndex) => {
                  const owner = MEMBERS[card.owner];
                  const ownerName = t(owner.nameKey);
                  return (
                  <article
                    key={`${day.weekdayKey}-${cardIndex}`}
                    className={`content-plan__card content-plan__card--${card.channel}`}
                  >
                    <span className="content-plan__channel">
                      {t(CHANNEL_LABEL_KEY[card.channel])}
                    </span>
                    <h3 className="content-plan__card-title">{t(card.titleKey)}</h3>
                    <div className="content-plan__card-foot">
                      <span className={`content-plan__badge content-plan__badge--${card.status}`}>
                        {t(STATUS_LABEL_KEY[card.status])}
                      </span>
                      <span
                        className="content-plan__owner"
                        title={ownerName}
                        aria-label={ownerName}
                      >
                        {owner.img ? (
                          <img src={owner.img} alt="" loading="lazy" />
                        ) : (
                          owner.initial
                        )}
                      </span>
                    </div>
                  </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
