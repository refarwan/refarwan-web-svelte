import type { HomeTranslation } from "./types";

export const jaJP: HomeTranslation = {
    metaTitle: "Aan Refarwan | フルスタック TypeScript 開発者 & ソフトウェアエンジニア",
    metaDescription:
        "モダンな JavaScript & TypeScript アーキテクチャに特化したフルスタック開発者。PHP などのバックエンド技術にも適応し、エンドツーエンドの Web アプリケーションを構築します。",
    hero: {
        role: "フルスタック JavaScript エンジニア",
        description:
            "フロントエンドからバックエンドまで、情熱を持って高品質な Web アプリケーションを構築します。ジョグジャカルタ在住で、質の高いデジタルソリューションを提供します。",
        viewProjects: "プロジェクトを見る"
    },
    about: {
        title: "私について",
        bio1: "SMK N 1 Bantul ソフトウェア工学科を卒業後、独学で Web プログラミングを深めました。モダンな UI と堅牢なバックエンドシステムの構築に強い情熱を持っています。",
        bio2: "常に最新の JavaScript エコシステムをキャッチアップし、クリーンで構造化されたコードで複雑な課題を解決することを得意としています。",
        experienceTitle: "職歴・経歴",
        experiences: [
            {
                role: "Web プログラマー",
                company: "PT Fresh Galang Mandiri",
                period: "2022年8月 - 2023年3月"
            },
            {
                role: "IT サポート & プログラマー",
                company: "Toko Kamera Mbantul",
                period: "2017年6月 - 2022年7月"
            }
        ]
    },
    skills: {
        title: "プログラミングスキル",
        description:
            "レスポンシブで堅牢なアプリケーションを具現化するために日々活用しているテクノロジーとツール群です。"
    },
    projects: {
        title: "注目のプロジェクト",
        subtitle:
            "データ管理、複雑な状態管理、レスポンシブ UI の実装力を示す厳選プロジェクトです。",
        items: [
            {
                id: "jualkamera",
                category: "フルスタック EC サイト",
                projectName: "Jualkamera.com Webサイト",
                description:
                    "Mbantul カメラ店のカタログサイト。POS（レジシステム）機能を備え、レジでの取引発生時に在庫がリアルタイムで自動更新されます。モダンスタックで高パフォーマンスと高度な状態管理を実現しています。",
                visitWebsite: "Webサイトを見る",
                imageSrc: "/www.jualkamera.com.png",
                url: "https://jualkamera.com"
            },
            {
                id: "annorakreasi",
                category: "企業研修・人材育成プラットフォーム",
                projectName: "Annora Cipta Kreasi Webサイト",
                description:
                    "企業プロファイルおよび人材育成・研修プラットフォーム（ソフトスキル、パブリックスピーキング、心理サービス、キャパシティビルディング）。講習スケジュール管理、ブログ記事、高速な登録フォームを完備。",
                visitWebsite: "Webサイトを見る",
                imageSrc: "/www.annorakreasi.com.png",
                url: "https://www.annorakreasi.com"
            }
        ]
    },
    cta: {
        title: "一緒に仕事しましょう",
        description:
            "信頼性の高いプラットフォームの構築や、一緒に実現したい刺激的なプロジェクトはありますか？ ぜひお気軽にお問い合わせください。",
        button: "お問い合わせ"
    }
};
