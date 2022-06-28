const result = {
  possibleTypes: {
    CollectModule: [
      'FeeCollectModuleSettings',
      'FreeCollectModuleSettings',
      'LimitedFeeCollectModuleSettings',
      'LimitedTimedFeeCollectModuleSettings',
      'RevertCollectModuleSettings',
      'TimedFeeCollectModuleSettings'
    ],
    FollowModule: [
      'FeeFollowModuleSettings',
      'ProfileFollowModuleSettings',
      'RevertFollowModuleSettings'
    ],
    MainPostReference: ['Mirror', 'Post'],
    MentionPublication: ['Comment', 'Post'],
    MirrorablePublication: ['Comment', 'Post'],
    Notification: [
      'NewCollectNotification',
      'NewCommentNotification',
      'NewFollowerNotification',
      'NewMentionNotification',
      'NewMirrorNotification'
    ],
    ProfileMedia: ['MediaSet', 'NftImage'],
    Publication: ['Comment', 'Mirror', 'Post'],
    PublicationSearchResultItem: ['Comment', 'Post'],
    ReferenceModule: ['FollowOnlyReferenceModuleSettings'],
    RelayResult: ['RelayError', 'RelayerResult'],
    SearchResult: ['ProfileSearchResult', 'PublicationSearchResult'],
    TransactionResult: ['TransactionError', 'TransactionIndexedResult']
  }
}
export default result
